import { StyleSheet } from 'react-native';
import { ThemeColors } from 'ThemeTypes';

// Function to create styles
export function createStyles(theme: ThemeColors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      fontFamily: "Vazirmatn_400Regular"
    },
    header: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 0.5,
      borderBottomColor: theme.secondary
    },
    headerTitle: {
      fontSize: 24,
      fontFamily: "CherryCreamSoda_400Regular",
      color: theme.primary,
    },
    listContainer: {
      padding: 16,
    },
    notificationItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 20,
    },
    notificationContent: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      marginRight: 12,
    },
    avatarContainer: {
      position: "relative",
      marginRight: 12,
    },
    avatar: {
      width: 44,
      height: 44,
      borderRadius: 22,
      borderWidth: 2,
      borderColor: theme.surface,
    },
    iconBadge: {
      position: "absolute",
      bottom: -4,
      right: -4,
      backgroundColor: theme.background,
      borderRadius: 12,
      width: 24,
      height: 24,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 2,
      borderColor: theme.surface,
    },
    notificationInfo: {
      flex: 1,
    },
    username: {
      color: theme.onBackground,
      fontSize: 14,
      fontWeight: "600",
      marginBottom: 2,
    },
    action: {
      color: theme.disabled,
      fontSize: 14,
      marginBottom: 2,
    },
    timeAgo: {
      color: theme.disabled,
      fontSize: 12,
    },
    postImage: {
      width: 44,
      height: 44,
      borderRadius: 6,
    },
    centered: {
      justifyContent: "center",
      alignItems: "center",
    },    
  });
}