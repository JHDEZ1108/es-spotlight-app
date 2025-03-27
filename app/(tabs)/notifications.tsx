import React from 'react';
import { View, Text, FlatList } from 'react-native';

import { api } from '@/convex/_generated/api';
import { useQuery } from 'convex/react';
import { Loader } from '@/components/Loader';
import NotificationItem from '@/components/Notification';

import { useTheme } from '@/context/ThemeProvider'; 
import { createStyles } from '@/styles/notifications.styles';
import { ThemeColors } from 'ThemeTypes';

import { Ionicons } from '@expo/vector-icons';

export default function Notifications() {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  
  const notifications = useQuery(api.notifications.getNotifications);

  if (notifications === undefined) return <Loader />;
  if (notifications.length === 0) return <NoNotificationsFound theme={theme} styles={styles} />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
      </View>
  
      <FlatList
        data={notifications}
        renderItem={({ item }) => <NotificationItem notification={item} theme={theme} styles={styles} />}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
  
}

function NoNotificationsFound({ theme, styles }: { theme: ThemeColors, styles: any }) {
  return (
    <View style={[styles.container, styles.centered]}>
      <Ionicons name="notifications-outline" size={48} color={theme.primary} />
      <Text style={{ fontSize: 20, color: theme.onBackground, paddingTop: 20 }}>
        No notifications yet
      </Text>
    </View>
  );
}
