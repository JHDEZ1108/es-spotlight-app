import { View, Text } from "react-native";
import { Image } from 'expo-image';
import { formatDistanceToNow } from "date-fns";

import { useTheme } from '@/context/ThemeProvider'; 
import { createStyles } from '@/styles/feed.styles';

// Comment interface with content, timestamp and user info
interface Comment {
  content: string;
  _creationTime: number;
  user: {
    fullname: string;
    image: string;
  };
}

export default function Comment({ comment }: { comment: Comment }) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.commentContainer}>
      {/* Avatar */}
      <Image source={{ uri: comment.user.image }} style={styles.commentAvatar} />
      
      {/* Comment content */}
      <View style={styles.commentContent}>
        <Text style={styles.commentUsername}>{comment.user.fullname}</Text>
        <Text style={styles.commentText}>{comment.content}</Text>
        
        {/* Time since comment was posted */}
        <Text style={styles.commentTime}>
          {formatDistanceToNow(comment._creationTime, { addSuffix: true })}
        </Text>
      </View>
    </View>
  );
}
