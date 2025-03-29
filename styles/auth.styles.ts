import { StyleSheet, Dimensions } from 'react-native';
import { ThemeColors } from 'ThemeTypes';

const { width, height } = Dimensions.get("window");

// Function to create styles
export function createStyles(theme: ThemeColors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      fontFamily: 'Vazirmatn_400Regular'
    },
    brandSection:{
      alignItems: 'center',
      marginTop: height * 0.12,
    },
    logoContainer:{
      width: 60,
      height: 60,
      backgroundColor: theme.background,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 10
    },
    appName: {
      fontSize: 30,
      fontWeight: '700',
      fontFamily: 'Vazirmatn_400Regular',
      color: theme.primary,
      letterSpacing: 0.5,
      marginBottom: 8
    },
    tagLine: {
      fontSize: 16,
      color: theme.secondary,
      letterSpacing: 1,
      textTransform: 'lowercase'
    },
    illustrationContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 40
    },
    illustration: {
      width: width * 0.75,
      height: height * 0.75,
      maxHeight: 200
    },
    loginSection: {
      width: '100%',
      paddingHorizontal: 24,
      paddingBottom: 40,
      alignItems: 'center'
    },
    googleButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.onBackground,
      paddingVertical: 16,
      marginVertical: 16,
      paddingHorizontal: 24,
      borderRadius: 14,
      width: '100%',
      maxWidth: 300,
      shadowColor: theme.shadow,
      shadowOffset: {
        width: 0,
        height: 4
      },
      shadowOpacity: 0.75,
      shadowRadius: 12,
      elevation: 5
    },
    googleIconContainer: {
      width: 24,
      height: 24,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
      
    },
    googleButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.primary,
    },
    termsText: {
      textAlign: 'center',
      fontSize: 12,
      color: theme.primary,
      maxWidth: 200
    }
    
  });
}