import React, { useCallback } from 'react';
import { StyleSheet, StatusBar } from 'react-native';
import { Stack } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { ThemeProvider, useTheme } from "@/context/ThemeProvider";
import * as SplashScreen from "expo-splash-screen";
import { useFonts, Vazirmatn_300Light, Vazirmatn_400Regular, Vazirmatn_600SemiBold } from "@expo-google-fonts/vazirmatn";
import { NotificationProvider } from "@/context/NotificationContext";
import Toast from "@/components/Toast";

// Prevent the splash screen from hiding automatically
SplashScreen.preventAutoHideAsync();

function RootLayoutContent() {
  const { theme, isDark } = useTheme();
  const [fontsLoaded] = useFonts({
    Vazirmatn_300Light,
    Vazirmatn_400Regular,
    Vazirmatn_600SemiBold,
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
    <SafeAreaProvider onLayout={onLayoutRootView}>
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
        <StatusBar 
          translucent 
          backgroundColor="transparent" 
          barStyle={isDark ? "light-content" : "dark-content"}
        />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="bookmarks" />
          <Stack.Screen name="create" />
          <Stack.Screen name="notifications" />
          <Stack.Screen name="profile" />
        </Stack>
        <Toast />
      </SafeAreaView>
    </SafeAreaProvider>
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
