import React, { useCallback, useEffect } from 'react';
import { Platform, StatusBar } from 'react-native';
import * as SplashScreen from "expo-splash-screen";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Toast from "@/components/Toast";
import { useFonts, Vazirmatn_300Light, Vazirmatn_400Regular, Vazirmatn_600SemiBold } from "@expo-google-fonts/vazirmatn";
import { CherryCreamSoda_400Regular  } from '@expo-google-fonts/cherry-cream-soda'
import { ThemeProvider, useTheme } from "@/context/ThemeProvider";
import { NotificationProvider } from "@/context/NotificationContext";
import AuthenticationProvider from '@/context/AuthenticaticationProvider';
import InitialLayout from '@/components/initialLayout';

import * as NavigationBar from "expo-navigation-bar";

// Prevent the splash screen from hiding automatically
SplashScreen.preventAutoHideAsync();

function RootLayoutContent() {
  const { theme, isDark } = useTheme();
  // Update the native navigation bar on Android
  useEffect(() => {
    if (Platform.OS === "android") {
      NavigationBar.setBackgroundColorAsync(theme.background);
      NavigationBar.setButtonStyleAsync(isDark ? "light" : "dark");
    }
  }, []);
  
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
