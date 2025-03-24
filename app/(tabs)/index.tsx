import React from 'react';
import { Text, View } from 'react-native';
import { useTheme } from '@/context/ThemeProvider'; 
import { createStyles } from '@/styles/auth.styles';
import ThemeToggle from '@/components/ThemeToggle';

export default function Index() {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Welcome to Your App</Text>
        <ThemeToggle />
      </View>
      <View style={styles.content}>
        <Text style={styles.text}>Your main content goes here.</Text>
      </View>
    </View>
  )
}