import { View, Text, Image, TouchableOpacity } from 'react-native';
import React from 'react';

import { useTheme } from '@/context/ThemeProvider'; 
import { createStyles } from '@/styles/auth.styles';

import Ionicons from '@expo/vector-icons/Ionicons';
import { useSSO } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';

export default function Login() {
  const { theme, isDark  } = useTheme();
  const styles = createStyles(theme);
  
  const logo = isDark ? require('@/assets/icons/logo-dark.png') : require('@/assets/icons/logo-light.png')
  const illustration  = isDark ? require('@/assets/icons/dark-login.png') : require('@/assets/icons/light-login.png')
  
  const { startSSOFlow } = useSSO();
  const router = useRouter();
  
  const handleGoogleSignIn = async () => {
    try {
      const { createdSessionId, setActive} = await startSSOFlow({strategy:"oauth_google"});
      
      if(setActive && createdSessionId){
        setActive({session: createdSessionId});
        router.replace("/(tabs)");
      }
    } catch (error) {
      console.error("Oauth error: ", error);
    }
  }
  
  return (
    <View style={styles.container}>
      { /* BRAND SECTION */ }
      <View style={styles.brandSection}>
        <View  style={styles.logoContainer}>
          <Image source={logo} resizeMode="contain" style={{ width: 50, height: 50 }} />
        </View>
        <Text style={styles.appName}>ESpotlight</Text>
        <Text style={styles.tagLine}>don't miss anything</Text>
      </View>
      { /* ILLUSTRATION */ }
      <View style={styles.illustrationContainer}>
        <Image 
          source={illustration}
          style={styles.illustration}
          resizeMode='contain'
        />
      </View>
      { /* LOGIN SECTION */ }
      <View style={styles.loginSection}>
        <TouchableOpacity 
          style={styles.googleButton}
          onPress={handleGoogleSignIn}
          activeOpacity={0.9}
        >
          <View style={styles.googleIconContainer}>
            <Ionicons name="logo-google" size={20} color={theme.secondary}/>
          </View>
          <Text style={styles.googleButtonText}>Continue with Google</Text>
        </TouchableOpacity>
        
        <Text style={styles.termsText}>
          By continuing, you agree to our Terms and Privacy Policy
        </Text>
      </View>
      
    </View>
  )
}
