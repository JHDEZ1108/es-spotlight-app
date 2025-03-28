import { StyleSheet, Dimensions } from 'react-native';
import { ThemeColors } from 'ThemeTypes';

const { width, height } = Dimensions.get("window");

// Function to create styles
export function createStyles(theme: ThemeColors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      fontFamily: "Vazirmatn_400Regular"
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 0.5,
      borderBottomColor: theme.surface,
    },
    headerLeft: {
      flexDirection: "row",
      alignItems: "center",
    },
    username: {
      fontSize: 20,
      fontWeight: "700",
      color: theme.onBackground,
    },
    headerRight: {
      flexDirection: "row",
      gap: 16,
    },
    headerIcon: {
      padding: 4,
    },
    profileInfo: {
      padding: 16,
    },
    avatarAndStats: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 16,
    },
    avatarContainer: {
      marginRight: 32,
    },
    avatar: {
      width: 86,
      height: 86,
      borderRadius: 43,
      borderWidth: 2,
      borderColor: theme.surface,
    },
    statsContainer: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "space-around",
    },
    statItem: {
      alignItems: "center",
    },
    statNumber: {
      fontSize: 17,
      fontWeight: "700",
      color: theme.onBackground,
      marginBottom: 4,
    },
    statLabel: {
      fontSize: 13,
      color: theme.disabled,
    },
    name: {
      fontSize: 15,
      fontWeight: "600",
      color: theme.onBackground,
      marginBottom: 4,
    },
    bio: {
      fontSize: 14,
      color: theme.onBackground,
      lineHeight: 20,
    },
    actionButtons: {
      flexDirection: "row",
      gap: 8,
      marginTop: 8,
    },
    editButton: {
      flex: 1,
      backgroundColor: theme.surface,
      padding: 8,
      borderRadius: 8,
      alignItems: "center",
    },
    editButtonText: {
      color: theme.onBackground,
      fontWeight: "600",
      fontSize: 14,
    },
    shareButton: {
      backgroundColor: theme.surface,
      padding: 8,
      borderRadius: 8,
      aspectRatio: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    gridItem: {
      flex: 1 / 3,
      aspectRatio: 1,
      padding: 1,
    },
    gridImage: {
      flex: 1,
    },
    modalContainer: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "flex-end",
    },
    modalContent: {
      backgroundColor: theme.background,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      padding: 20,
      minHeight: 400,
    },
    modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 20,
    },
    modalTitle: {
      color: theme.onBackground,
      fontSize: 18,
      fontWeight: "600",
    },
    inputContainer: {
      marginBottom: 20,
    },
    inputLabel: {
      color: theme.disabled,
      marginBottom: 8,
      fontSize: 14,
    },
    input: {
      backgroundColor: theme.surface,
      borderRadius: 8,
      padding: 12,
      color: theme.onBackground,
      fontSize: 16,
    },
    bioInput: {
      height: 100,
      textAlignVertical: "top",
    },
    saveButton: {
      backgroundColor: theme.secondary,
      padding: 16,
      borderRadius: 8,
      alignItems: "center",
      marginTop: 20,
    },
    saveButtonText: {
      color: theme.background,
      fontSize: 16,
      fontWeight: "600",
    },
    modalBackdrop: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.9)",
      justifyContent: "center",
    },
    postDetailContainer: {
      backgroundColor: theme.background,
      maxHeight: height * 0.9,
    },
    postDetailHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-end",
      padding: 12,
      borderBottomWidth: 0.5,
      borderBottomColor: theme.surface,
    },
    postDetailImage: {
      width: width,
      height: width,
    },
    followButton: {
      backgroundColor: theme.primary,
      paddingHorizontal: 24,
      paddingVertical: 8,
      borderRadius: 8,
      marginTop: 16,
    },
    followingButton: {
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.secondary,
    },
    followButtonText: {
      color: theme.onBackground,
      fontSize: 14,
      fontWeight: "600",
      textAlign: "center",
    },
    followingButtonText: {
      color: theme.onBackground,
      textAlign: "center",
    },
    noPostsContainer: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 48,
      gap: 12,
    },
    noPostsText: {
      color: theme.disabled,
      fontSize: 16,
    },
    centered: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    postsGrid: {
      flex: 1,
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: theme.onBackground,
    },
    
  });
}