import React, { useState } from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator, ScrollView, TextInput } from 'react-native';

import { useTheme } from '@/context/ThemeProvider'; 
import { createStyles } from '@/styles/create.styles';

import { useUser } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import * as FileSystem from "expo-file-system";

import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";

export default function CreateScreen() {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const router = useRouter();
  const { user } = useUser();
  
  const [caption, setCaption] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isSharing, setIsSharing] = useState(false);
  
  // Hooks for mutations
  const generateUploadUrl = useMutation(api.posts.generateUploadUrl);
  const createPost = useMutation(api.posts.createPost);

  // Function to pick image from the device library
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
    });

    if (!result.canceled) setSelectedImage(result.assets[0].uri);
  };
  
  // Early return when no image is selected
  if (!selectedImage) {
    return (
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={28} color={theme.primary} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>New Post</Text>
            <View style={{ width: 28 }} />
          </View>

          <TouchableOpacity style={styles.emptyImageContainer} onPress={pickImage}>
            <Ionicons name="image-outline" size={48} color={theme.disabled} />
            <Text style={styles.emptyImageText}>Tap to select an image</Text>
          </TouchableOpacity>
        </View>
    );
  }; 
  
  // Handles sharing the post
  const handleShare = async () => {
    if(!selectedImage) return;
    
    try {
      setIsSharing(true);
      const uploadUrl = await generateUploadUrl();
      
      const uploadResult = await FileSystem.uploadAsync(uploadUrl,
      selectedImage, {
        httpMethod: "POST",
        uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
        mimeType: "image/jpeg",
      });
      
      if(uploadResult.status !== 200) throw new Error("Upload failed");
      
      const { storageId } = JSON.parse(uploadResult.body);
      await createPost({storageId, caption})
      
      setSelectedImage(null);
      setCaption("");
      
      router.push("/(tabs)")
      
    } catch (error) {
      console.log("Error sharing post")
    }finally{
      setIsSharing(false);
    }
  }
  
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.contentContainer}> 
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={()=> {
              setSelectedImage(null);
              setCaption("");
            }}
            disabled={isSharing}
          >
            <Ionicons 
              name="close-outline"
              size={28}
              color={isSharing? theme.disabled : theme.onBackground}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>New Post</Text>
          <TouchableOpacity
            style={[styles.shareButton, isSharing && styles.shareButtonDisabled]}
            onPress={handleShare}
          >
            {isSharing ? (
              <ActivityIndicator size="small" color={theme.primary}/>
            ) : (
              <Text style={styles.shareText}>Share</Text>
            )}
          </TouchableOpacity>
        </View>
        
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          bounces={false}
          keyboardShouldPersistTaps="handled"
          contentOffset={{ x: 0, y: 100}}
        >
          <View
            style={[styles.content, isSharing && styles.contentDisabled]}
          >
            {/* IMAGE SECTION */}
            <View style={styles.imageSection}>
              <Image
                source={selectedImage}
                style={styles.previewImage}
                contentFit="cover"
                transition={200}
              />
              <TouchableOpacity
                style={styles.changeImageButton}
                onPress={pickImage}
                disabled={isSharing}
              >
                <Ionicons name="image-outline" size={20} color={theme.onBackground} />
                <Text style={styles.changeImageText}>Change</Text>
              </TouchableOpacity>
            </View>
            
            {/* INPUT SECTION */}
            <View style={styles.inputSection}>
              <View style={styles.captionContainer}>
                <Image
                  source={user?.imageUrl}
                  style={styles.userAvatar}
                  contentFit="cover"
                  transition={200}
                />
                <TextInput
                  style={styles.captionInput}
                  placeholder="Write a caption..."
                  placeholderTextColor={theme.disabled}
                  multiline
                  value={caption}
                  onChangeText={setCaption}
                  editable={!isSharing}
                />
              </View>
            </View>
            
          </View>
        </ScrollView>
        
      </View>
    </KeyboardAvoidingView>
);};