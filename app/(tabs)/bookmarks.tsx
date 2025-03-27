import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Image } from 'expo-image';

import { Loader } from '@/components/Loader';
import { api } from '@/convex/_generated/api';
import { useQuery } from 'convex/react';

import { useTheme } from '@/context/ThemeProvider'; 
import { createStyles } from '@/styles/feed.styles';
import { ThemeColors } from 'ThemeTypes';

export default function Bookmarks() {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  // Fetch all bookmarked posts for the current user
  const bookmarkedPosts = useQuery(api.bookmarks.getBookmarkedPosts);

  // Show loader while fetching
  if (bookmarkedPosts === undefined) return <Loader />;

  // Show fallback UI if no bookmarks exist
  if (bookmarkedPosts.length === 0) return <NoBookmarksFound theme={theme} />;

  return (
    <View style={styles.container}>
      {/* Page Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bookmarks</Text>
      </View>

      {/* Grid of bookmarked posts */}
      <ScrollView
        contentContainerStyle={{
          padding: 8,
          flexDirection: "row",
          flexWrap: "wrap",
        }}
      >
        {bookmarkedPosts.map((post) => {
          if (!post) return null;

          return (
            <View
              key={post._id}
              style={{ width: "33.33%", padding: 1 }}
            >
              <Image
                source={post.imageUrl}
                style={{ width: "100%", aspectRatio: 1 }}
                contentFit="cover"
                transition={200}
                cachePolicy="memory-disk"
              />
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

// Empty state UI if no bookmarks are found
const NoBookmarksFound = ({ theme }: { theme: ThemeColors }) => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.background,
      }}
    >
      <Text style={{ color: theme.primary, fontSize: 22 }}>
        No bookmarked posts yet
      </Text>
    </View>
  );
};
