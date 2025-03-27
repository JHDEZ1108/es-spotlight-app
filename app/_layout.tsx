import React, { useCallback } from 'react';
import { StyleSheet, StatusBar } from 'react-native';
import * as SplashScreen from "expo-splash-screen";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Toast from "@/components/Toast";
import { useFonts, Vazirmatn_300Light, Vazirmatn_400Regular, Vazirmatn_600SemiBold } from "@expo-google-fonts/vazirmatn";
import { CherryCreamSoda_400Regular  } from '@expo-google-fonts/cherry-cream-soda'
import { ThemeProvider, useTheme } from "@/context/ThemeProvider";
import { NotificationProvider } from "@/context/NotificationContext";
import AuthenticationProvider from '@/context/AuthenticaticationProvider';
import InitialLayout from '@/components/initialLayout';

// Prevent the splash screen from hiding automatically
SplashScreen.preventAutoHideAsync();

function RootLayoutContent() {
  const { theme, isDark } = useTheme();
  const [fontsLoaded] = useFonts({
    Vazirmatn_300Light,
    Vazirmatn_400Regular,
    Vazirmatn_600SemiBold,
    CherryCreamSoda_400Regular
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <AuthenticationProvider>
      <SafeAreaProvider onLayout={onLayoutRootView}>
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
          <StatusBar 
            translucent 
            backgroundColor="transparent" 
            barStyle={isDark ? "light-content" : "dark-content"}
          />
            <InitialLayout />
          <Toast />
        </SafeAreaView>
      </SafeAreaProvider>
    </ AuthenticationProvider>
  );
}

export default function RootLayout() {
  return (
    <NotificationProvider>
      <ThemeProvider>
        <RootLayoutContent />
      </ThemeProvider>
    </NotificationProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
