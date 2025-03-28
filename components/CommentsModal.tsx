import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import { View, Text, Modal, TextInput, KeyboardAvoidingView, Platform, TouchableOpacity, FlatList } from "react-native";

import { Loader } from "./Loader";
import Comment from "./Comment";

import { useTheme } from '@/context/ThemeProvider'; 
import { createStyles } from '@/styles/feed.styles';

// Props type for modal
type CommentsModal = {
  postId: Id<"posts">;
  visible: boolean;
  onClose: () => void;
  // onCommentAdded: () => void;
};

export default function CommentsModal({ onClose, postId, visible }: CommentsModal) {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  
  const [newComment, setNewComment] = useState("");

  // Fetch comments for given post
  const comments = useQuery(api.comments.getComments, { postId });

  // Mutation to add a comment
  const addComment = useMutation(api.comments.addComment);

  // Handle comment submission
  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      await addComment({
        content: newComment,
        postId,
      });

      setNewComment("");
      // onCommentAdded();
    } catch (error) {
      console.log("Error adding comment:", error);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.modalContainer}
      >
        {/* Modal Header */}
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color={theme.onBackground} />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Comments</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Comments List or Loader */}
        {comments === undefined ? (
          <Loader />
        ) : (
          <FlatList
            data={comments}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => <Comment comment={item} />}
            contentContainerStyle={styles.commentsList}
          />
        )}
        
        {/* Comment Input and Post Button */}
        <View style={styles.commentInput}>
          <TextInput
            style={styles.input}
            placeholder="Add a comment..."
            placeholderTextColor={theme.disabled}
            value={newComment}
            onChangeText={setNewComment}
            multiline
          />
          <TouchableOpacity onPress={handleAddComment} disabled={!newComment.trim()}>
            <Text style={[styles.postButton, !newComment.trim() && styles.postButtonDisabled]}>
              Post
            </Text>
          </TouchableOpacity>
        </View>

      </KeyboardAvoidingView>
    </Modal>
  );
}
