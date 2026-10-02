import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { ScrollView, Text, TextInput, View } from 'react-native';
import { EmptyState } from '../components/EmptyState';
import { Avatar } from '../components/Avatar';
import { FadeSlideIn } from '../components/FadeSlideIn';
import { Group } from '../components/Group';
import { PressableScale } from '../components/PressableScale';
import { ME_CREATOR_ID, canReadPost, getCreator } from '../data';
import { hapticError, hapticLight, hapticSelect } from '../haptics';
import { useStore } from '../store';
import { colors } from '../theme';
import { validateClubPost } from '../validation';
import { homeStyles as styles } from './homeStyles';

type Props = {
  onOpenCreator: (id: string) => void;
};

export function ClubScreen({ onOpenCreator }: Props) {
  const { posts, memberships, user, togglePostLike, isPostLiked, addPost, showToast, memberPrice } =
    useStore();
  const [onlyMembers, setOnlyMembers] = useState(false);
  const [draft, setDraft] = useState('');
  const [postError, setPostError] = useState<string | null>(null);

  const visible = useMemo(() => {
    if (!onlyMembers) return posts;
    return posts.filter(
      (post) => post.creatorId === ME_CREATOR_ID || memberships[post.creatorId] != null,
    );
  }, [onlyMembers, posts, memberships]);

  const publish = () => {
    const error = validateClubPost(draft);
    if (error) {
      setPostError(error);
      hapticError();
      return;
    }
    addPost(draft);
    setDraft('');
    setPostError(null);
    hapticSelect();
    showToast('Publié dans le Club');
  };

  return (
    <ScrollView
      style={styles.body}
      contentContainerStyle={styles.tabSceneContent}
      keyboardShouldPersistTaps="handled"
    >
      <FadeSlideIn>
        <Text style={styles.title}>Club</Text>
        <Text style={styles.empty}>Le fil des ateliers. Les posts membres se débloquent avec un palier.</Text>
        <View style={styles.chips}>
          <PressableScale
            onPress={() => {
              hapticSelect();
              setOnlyMembers(false);
            }}
            contentStyle={[styles.chip, !onlyMembers && styles.chipActive]}
          >
            <Text style={[styles.chipText, !onlyMembers && styles.chipTextActive]}>Tout</Text>
          </PressableScale>
          <PressableScale
            onPress={() => {
              hapticSelect();
              setOnlyMembers(true);
            }}
            contentStyle={[styles.chip, onlyMembers && styles.chipActive]}
          >
            <Text style={[styles.chipText, onlyMembers && styles.chipTextActive]}>Membres</Text>
          </PressableScale>
        </View>

        <View style={[styles.composer, postError && styles.composerError]}>
          <TextInput
            value={draft}
            onChangeText={(value) => {
              setDraft(value);
              if (postError) setPostError(null);
            }}
            placeholder={`Écrire au Club${user ? `, ${user.name.split(' ')[0]}` : ''}…`}
            placeholderTextColor={colors.placeholder}
            style={styles.composerInput}
            multiline
            maxLength={240}
          />
          {postError ? <Text style={styles.fieldError}>{postError}</Text> : null}
          <Text style={[styles.followMeta, { alignSelf: 'flex-end' }]}>{draft.trim().length}/240</Text>
          <PressableScale
            contentStyle={[styles.chip, styles.chipActive, { alignSelf: 'flex-end', marginTop: 8 }]}
            onPress={publish}
          >
            <Text style={[styles.chipText, styles.chipTextActive]}>Publier</Text>
          </PressableScale>
        </View>

        {visible.length === 0 ? (
          <EmptyState
            title="Fil calme"
            body="Abonne-toi à un atelier depuis sa page, ou passe sur Tout pour voir les teasers."
            actionLabel="Voir tout le Club"
            onAction={() => setOnlyMembers(false)}
          />
        ) : (
          <Group inset={16}>
            {visible.map((post) => {
            const creator =
              post.creatorId === ME_CREATOR_ID
                ? {
                    id: ME_CREATOR_ID,
                    name: user?.name ?? 'Toi',
                    meta: 'Membre Roux',
                    color: colors.starship,
                  }
                : getCreator(post.creatorId);
            if (!creator) return null;
            const liked = isPostLiked(post.id);
            const canOpen = post.creatorId !== ME_CREATOR_ID;
            const unlocked = canReadPost(post, memberPrice(post.creatorId));
            return (
              <View key={post.id} style={styles.post}>
                <PressableScale
                  contentStyle={styles.followRow}
                  onPress={() => {
                    if (canOpen) onOpenCreator(creator.id);
                  }}
                  disabled={!canOpen}
                >
                  <Avatar
                    photo={'photo' in creator ? creator.photo : undefined}
                    color={creator.color}
                  />
                  <View>
                    <Text style={styles.followName}>{creator.name}</Text>
                    <Text style={styles.followMeta}>{creator.meta}</Text>
                  </View>
                </PressableScale>
                {unlocked ? (
                  <Text style={styles.detailBlurb}>{post.text}</Text>
                ) : (
                  <>
                    <Text style={styles.lockedText} numberOfLines={2}>
                      {post.text}
                    </Text>
                    <PressableScale
                      contentStyle={[styles.chip, styles.chipActive, { alignSelf: 'flex-start' }]}
                      onPress={() => onOpenCreator(creator.id)}
                    >
                      <Text style={[styles.chipText, styles.chipTextActive]}>
                        S’abonner dès {post.minPrice} € pour lire
                      </Text>
                    </PressableScale>
                  </>
                )}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  {unlocked ? (
                    <PressableScale
                      style={styles.likeRow}
                      onPress={() => {
                        hapticLight();
                        togglePostLike(post.id);
                      }}
                    >
                      <Ionicons
                        name={liked ? 'heart' : 'heart-outline'}
                        size={16}
                        color={liked ? colors.heart : colors.muted}
                      />
                      <Text style={styles.likeText}>{liked ? 'Aimé' : 'Aimer'}</Text>
                    </PressableScale>
                  ) : (
                    <View />
                  )}
                  <Text style={styles.postTime}>{post.time}</Text>
                </View>
              </View>
            );
          })}
          </Group>
        )}
      </FadeSlideIn>
    </ScrollView>
  );
}
