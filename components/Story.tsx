import { createStyles } from '@/styles/feed.styles';
import { View, Text, Image, TouchableOpacity } from "react-native";
import { useTheme } from '@/context/ThemeProvider'; 

type Story = {
    id: string;
    username: string;
    avatar: string;
    hasStory: boolean;
};

export default function Story({ story }: { story: Story }) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <TouchableOpacity style={styles.storyWrapper}>
      <View style={[styles.storyRing, !story.hasStory && styles.noStory]}>
        <Image source={{ uri: story.avatar }} style={styles.storyAvatar} />
      </View>
      <Text style={styles.storyUsername}>{story.username}</Text>
    </TouchableOpacity>
  );
}
