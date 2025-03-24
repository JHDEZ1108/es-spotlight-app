import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Tabs } from "expo-router";
import { useTheme } from '@/context/ThemeProvider';
import { ThemeColors } from 'ThemeTypes';

import FontAwesome from '@expo/vector-icons/FontAwesome'; 
import AntDesign from '@expo/vector-icons/AntDesign';     
import Ionicons from '@expo/vector-icons/Ionicons'; 


interface TabIconProps {
  focused: boolean;
  icon: React.ReactElement;
  title: string;
}

function createStyles(theme: ThemeColors) {
  return StyleSheet.create({
    tabFocused: {
      flexDirection: 'row',
      width: '100%',
      flex: 1,
      minWidth: 75,
      minHeight: 64,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 100,
      overflow: 'hidden',
      marginTop: 16,
      backgroundColor: theme.primary,
      paddingHorizontal: 10,
      paddingVertical: 5,
    },
    tab: {
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 16,
      borderRadius: 100,
      minHeight: 64,
    },
    text: {
      fontSize: 16,
      fontWeight: 'bold',
      marginLeft: 8,
      color: theme.surface,
    },
    icon: {
      width: 24,
      height: 24,
      tintColor: theme.primary,
    }
  });
}

function TabIcon({ focused, title }: TabIconProps) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const getIcon = (name: string, focused: boolean) => {
    switch(name) {
      case 'Home':
        return <Ionicons name={focused ? "home" : "home-outline"} size={24} color={focused ? theme.secondary : theme.primary} />;
      case 'Bookmarks':
        return <FontAwesome name={focused ? "bookmark" : "bookmark-o"} size={24} color={focused ? theme.secondary : theme.primary} />;
      case 'Create':
        return <AntDesign name={focused ? "plussquare" : "plussquareo"} size={24} color={focused ? theme.secondary : theme.primary} />;
      case 'Notifications':
        return <FontAwesome name={focused ? "heart" : "heart-o"} size={24} color={focused ? theme.secondary : theme.primary} />;
      case 'Profile':
        return <Ionicons name={focused ? "person-circle-sharp" : "person-circle-outline"} size={24} color={focused ? theme.secondary : theme.primary} />;
      default:
        return null;
    }
  };

  return (
    <View style={focused ? styles.tabFocused : styles.tab}>
      {getIcon(title, focused)}
    </View>
  );
}

export default function TabsLayout() {
  const { theme } = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarItemStyle: {
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        },
        tabBarStyle: {
          backgroundColor: theme.surface,
          borderRadius: 50,
          marginHorizontal: 20,
          marginBottom: 36,
          height: 52,
          position: 'absolute',
          overflow: 'hidden',
          borderWidth: 1,
          borderColor: theme.primary,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={<Ionicons name="home" size={24} />} title="Home" />
          ),
        }}
      />
      <Tabs.Screen
        name="bookmarks"
        options={{
          title: "Bookmarks",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={<FontAwesome name="bookmark" size={24} />} title="Bookmarks" />
          ),
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: "Create",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={<AntDesign name="plussquare" size={24} />} title="Create" />
          ),
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: "Notifications",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={<FontAwesome name="heart" size={24} />} title="Notifications" />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={<Ionicons name="person-circle-sharp" size={24} />} title="Profile" />
          ),
        }}
      />
    </Tabs>
  );
}
