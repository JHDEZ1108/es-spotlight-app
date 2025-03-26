import { StyleSheet, Dimensions } from 'react-native';
import { ThemeColors } from 'ThemeTypes';

const { width } = Dimensions.get("window");

// Function to create styles
export function createStyles(theme: ThemeColors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    contentContainer: {
      flex: 1
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 0.5,
      borderBottomColor: theme.secondary
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: theme.onBackground, 
    },
    contentDisabled: {
      opacity: 0.7,
    },
    shareButton: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      minWidth: 60,
      alignItems: "center",
      justifyContent: "center",
    },
    shareButtonDisabled: {
      opacity: 0.5
    },
    shareText:{
      color: theme.primary,
      fontSize: 16,
      fontWeight: "600",
    },
    shareTextDisabled: {
      color: theme.disabled
    },
    emptyImageContainer:{
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      gap: 12
    },
    emptyImageText: {
      color: theme.disabled,
      fontSize: 16,
    },
    content: {
      flex: 1
    },
    scrollContent: {
      flexGrow: 1
    },
    imageSection:{
      width: width,
      height: width,
      backgroundColor: theme.surface,
      justifyContent: "center",
      alignItems: "center"
    },
    previewImage: {
      width: "100%",
      height: "100%"
    },
    changeImageButton: {
      position: "absolute",
      bottom: 16,
      right: 16,
      backgroundColor: theme.secondary,
      flexDirection: "row",
      alignContent: "center",
      padding: 8,
      borderRadius: 8,
      gap: 6
    },
    changeImageText:{
      color: theme.onBackground,
      fontSize: 14,
      fontWeight: "500"
    },
    inputSection: {
      padding: 16,
      flex: 1
    },
    captionContainer:{
      flexDirection: "row",
      alignItems: "flex-start"
    },
    userAvatar: {
      width: 36,
      height: 36,
      borderRadius: 18,
      marginRight: 12
    },
    captionInput: {
      flex: 1,
      color: theme.onBackground,
      fontSize: 16,
      paddingTop: 8,
      minHeight: 40
    }
  });
}