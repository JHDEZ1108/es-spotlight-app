// Import required modules
import React from 'react';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign'; 
import { useTheme } from '@/context/ThemeProvider'; 
import { useAuth } from '@clerk/clerk-expo';

// LogoutButton component definition
const LogoutButton = () => {
  const { theme } = useTheme();  
  const { signOut } = useAuth();

  // Local styles for the logout button
  const styles = StyleSheet.create({
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.secondary,
      paddingVertical: 12,
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
      shadowOpacity: 0.1,
      elevation: 5,
    },
    buttonText: {
      color: theme.onPrimary,
      marginLeft: 10,
    }
  });

  return (
    <View>
      <TouchableOpacity onPress={() => signOut()} style={styles.button}>
        <AntDesign name="logout" size={24} color={theme.onPrimary} />
        <Text style={styles.buttonText}>Sign out</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LogoutButton;
