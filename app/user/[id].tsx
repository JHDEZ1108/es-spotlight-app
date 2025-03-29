import React, { useState } from 'react';
import { FlatList, ScrollView, Text, TouchableOpacity, View, Modal } from 'react-native';

import { useTheme } from '@/context/ThemeProvider'; 
import { createStyles } from '@/styles/profile.styles';
import { ThemeColors } from 'ThemeTypes';

import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';

import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Doc, Id } from '@/convex/_generated/dataModel';

import { Loader } from '@/components/Loader';

export default function UserProfileScreen() {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  // Get the dynamic user ID from the URL
  const { id } = useLocalSearchParams();
  const router = useRouter(); 

  // Fetch user profile, posts, and follow status
  const profile = useQuery(api.users.getUserProfile, { id: id as Id<"users"> });
  const posts = useQuery(api.posts.getPostsByUser, { userId: id as Id<"users"> });
  const isFollowing = useQuery(api.users.isFollowing, { followingId: id as Id<"users"> });

  const toggleFollow = useMutation(api.users.toggleFollow);

  const [selectedPost, setSelectedPost] = useState<Doc<"posts"> | null>(null);

  // Navigate back or fallback to /tabs
  const handleBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace("/(tabs)");
  };

  // Show loader until all data is loaded
  if (posts === undefined || profile === undefined || isFollowing === undefined) return <Loader />;

  return (
    <View style={styles.container}>
      {/* Header with back button and username */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color={theme.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{profile.username}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileInfo}>
          {/* Avatar + Stats section */}
          <View style={styles.avatarAndStats}>
            <View style={styles.avatarContainer}>
              <Image
                source={profile.image}
                style={styles.avatar}
                contentFit="cover"
                transition={200}
              />
            </View>

            {/* User statistics */}
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{profile.posts}</Text>
                <Text style={styles.statLabel}>Posts</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{profile.followers}</Text>
                <Text style={styles.statLabel}>Followers</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{profile.following}</Text>
                <Text style={styles.statLabel}>Following</Text>
              </View>
            </View>
          </View>

          {/* Full name and bio */}
          <Text style={styles.name}>{profile.fullname}</Text>
          {profile.bio && <Text style={styles.bio}>{profile.bio}</Text>}

          {/* Follow/Unfollow button */}
          <TouchableOpacity
            style={[styles.followButton, isFollowing && styles.followingButton]}
            onPress={() => toggleFollow({ followingId: id as Id<"users"> })}
          >
            <Text style={[styles.followButtonText, isFollowing && styles.followingButtonText]}>
              {isFollowing ? "Following" : "Follow"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Post grid or fallback if empty */}
        <View style={styles.postsGrid}>
          {posts.length === 0 && <NoPostsFound theme={theme} />}
          <FlatList 
            data={posts}
            numColumns={3}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.gridItem}
                onPress={() => setSelectedPost(item)} // Open image modal
              >
                <Image
                  source={item.imageUrl}
                  style={styles.gridImage}
                  contentFit='cover'
                  transition={200}
                />
              </TouchableOpacity>
            )}
          />
        </View>

        {/* Image modal preview */}
        <Modal
          visible={!!selectedPost}
          animationType="fade"
          transparent={true}
          onRequestClose={() => setSelectedPost(null)}
        >
          <View style={styles.modalBackdrop}>
            {selectedPost && (
              <View style={styles.postDetailContainer}>
                <View style={styles.postDetailHeader}>
                  <TouchableOpacity onPress={() => setSelectedPost(null)}>
                    <Ionicons name="close" size={24} color={theme.onBackground} />
                  </TouchableOpacity>
                </View>
                <Image
                  source={selectedPost.imageUrl}
                  cachePolicy="memory-disk"
                  style={styles.postDetailImage}
                />
              </View>
            )}
          </View>
        </Modal>
      </ScrollView>
    </View>
  );
}

// Component shown when user has no posts
function NoPostsFound({ theme }: { theme: ThemeColors }) {
  return (
    <View
      style={{
        height: "100%",
        backgroundColor: theme.background,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Ionicons name="images-outline" size={48} color={theme.primary} />
      <Text style={{ fontSize: 20, color: theme.onBackground }}>No posts yet</Text>
    </View>
  );
}
