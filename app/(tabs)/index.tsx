import React from 'react';
import { FlatList, Text, View, ViewStyle } from 'react-native';

import { useTheme } from '@/context/ThemeProvider'; 
import { createStyles } from '@/styles/feed.styles';
import ThemeToggle from '@/components/ThemeToggle';
import { ThemeColors } from 'ThemeTypes';

import { STORIES } from '@/constants/mock-data';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

import Story from '@/components/Story';
import { Loader } from '@/components/Loader';
import Post from '@/components/Post';
interface Styles {
  storiesContainer: ViewStyle;
}

interface StoriesSectionProps {
  styles: Styles;
}

type StoryTypes = {
  id: string;
  username: string;
  avatar: string;
  hasStory: boolean;
};

export default function Index() {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  
  
  const posts = useQuery(api.posts.getFeedPost);
  if(posts === undefined) return <Loader />
  if(posts.length === 0) return <NoPostsFound theme={theme}/>
  
  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { fontFamily: 'CherryCreamSoda_400Regular' }]}>EffortStack</Text>
        <ThemeToggle />
      </View>
      
      {/* FEED COMPONENT */}
      <FlatList
        data={posts}
        renderItem={({item}) => <Post post={item}/>}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80}}
        ListHeaderComponent={<StoriesSection styles={styles}/>}
      />
      
    </View>
  )
}

const StoriesSection: React.FC<StoriesSectionProps> = ({ styles }) => {
  // RenderItem
  const renderItem = ({ item } : { item : StoryTypes }) => {
    return <Story key={item.id} story={item} />;
  };

  return (
    <FlatList
      data={STORIES}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      style={styles.storiesContainer}
    />
  );
};

const NoPostsFound = ({ theme }: { theme: ThemeColors }) => (
  <View
    style={{
      flex: 1,
      backgroundColor: theme.background,
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <Text style={{ fontSize: 20, color: theme.primary }}>No posts yet</Text>
  </View>
);
