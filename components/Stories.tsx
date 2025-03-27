import { FlatList } from 'react-native';
import Story from '@/components/Story';
import { STORIES } from '@/constants/mock-data';

type StoryTypes = {
  id: string;
  username: string;
  avatar: string;
  hasStory: boolean;
};

export default function StoriesSection ({ styles } : { styles: any}){
  // RenderItem
  const renderItem = ({ item } : { item : StoryTypes }) => {
    return <Story key={item.id} story={item} />;
  };

  return (
    <FlatList
      data={STORIES}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      style={styles.storiesContainer}
    />
  );
};