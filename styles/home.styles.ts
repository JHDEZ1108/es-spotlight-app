import { StyleSheet } from 'react-native';
import { ThemeColors } from 'ThemeTypes';

// Function to create styles
export function createStyles(theme: ThemeColors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "Vazirmatn_400Regular"
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 15,
      width: '100%',
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    headerText: {
      fontSize: 22,
      color: theme.onBackground, 
    },
    content: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    text: {
      fontSize: 18,
      color: theme.onBackground,
    },
  });
}