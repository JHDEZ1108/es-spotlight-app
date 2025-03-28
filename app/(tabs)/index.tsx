import React, { useState } from 'react';
import { FlatList, RefreshControl, Text, View } from 'react-native';

import { useTheme } from '@/context/ThemeProvider'; 
import { createStyles } from '@/styles/feed.styles';
import ThemeToggle from '@/components/ThemeToggle';
import { ThemeColors } from 'ThemeTypes';

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

import { Loader } from '@/components/Loader';
import Post from '@/components/Post';
import StoriesSection  from '@/components/Stories';


export default function Index() {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  
  const [refreshing, setRefreshing] = useState(false);
  
  const posts = useQuery(api.posts.getFeedPost);
  if(posts === undefined) return <Loader />
  if(posts.length === 0) return <NoPostsFound theme={theme}/>
  
  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      //tanstack query
    }, 2000)
  }
  
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
        refreshControl={
          <RefreshControl 
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.secondary}
          />
        }
      />
      
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
