import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useTheme } from '@/context/ThemeProvider'; 
import { createStyles } from '@/styles/feed.styles';
import ThemeToggle from '@/components/ThemeToggle';
import { STORIES } from '@/constants/mock-data';
import Story from '@/components/Story';

export default function Index() {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  
  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>EffortStack</Text>
        <ThemeToggle />
      </View>
      
      {/* STORY COMPONENT */}
      <ScrollView showsVerticalScrollIndicator={false}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.storiesContainer}
        >
          {STORIES.map((story) =>(
            <Story key={story.id} story={story}/>
          ))}
        </ScrollView>
      </ScrollView>
      
    </View>
  )
}