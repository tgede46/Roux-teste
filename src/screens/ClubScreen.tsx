import { Pressable, ScrollView, Text, View } from 'react-native';
import { FadeSlideIn } from '../components/FadeSlideIn';
import { CLUB_POSTS, getCreator } from '../data';
import { homeStyles as styles } from './homeStyles';

type Props = {
  onOpenCreator: (id: string) => void;
};

export function ClubScreen({ onOpenCreator }: Props) {
  return (
    <ScrollView style={styles.body} contentContainerStyle={styles.content}>
      <FadeSlideIn>
        <Text style={styles.title}>Club</Text>
        <Text style={styles.empty}>Le fil des ateliers Roux. Tape un nom pour ouvrir le profil.</Text>
        {CLUB_POSTS.map((post) => {
          const creator = getCreator(post.creatorId);
          if (!creator) return null;
          return (
            <Pressable key={post.id} style={styles.post} onPress={() => onOpenCreator(creator.id)}>
              <View style={styles.followRow}>
                <View style={[styles.avatar, { backgroundColor: creator.color }]} />
                <View>
                  <Text style={styles.followName}>{creator.name}</Text>
                  <Text style={styles.followMeta}>{creator.meta}</Text>
                </View>
              </View>
              <Text style={styles.detailBlurb}>{post.text}</Text>
              <Text style={styles.postTime}>{post.time}</Text>
            </Pressable>
          );
        })}
      </FadeSlideIn>
    </ScrollView>
  );
}
