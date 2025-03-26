import React from 'react';
import { ScrollView, Text, View } from 'react-native';

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
        <Text style={styles.headerTitle}>EffortStack</Text>
        <ThemeToggle />
      </View>
      
      {/* STORY COMPONENT */}
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.storiesContainer}
        >
          {STORIES.map((story) =>(
            <Story key={story.id} story={story}/>
          ))}
        </ScrollView>
        {posts.map((post => (
          <Post key={post._id} post={post} />
        )))}
      </ScrollView>
      
    </View>
  )
}

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
