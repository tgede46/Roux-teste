import { useState } from 'react';
import { ScrollView, Text, TextInput, View } from 'react-native';
import { FadeSlideIn } from '../components/FadeSlideIn';
import { PressableScale } from '../components/PressableScale';
import { type DropKind } from '../data';
import { hapticError, hapticSelect, hapticSuccess } from '../haptics';
import { goBack } from '../nav';
import { useStore } from '../store';
import { colors } from '../theme';
import { validateClubPost } from '../validation';
import { homeStyles as styles } from './homeStyles';

const PALIERS = [0, 4, 8, 12] as const;
const KINDS: { id: DropKind; label: string }[] = [
  { id: 'club', label: 'Club' },
  { id: 'product', label: 'Drop' },
  { id: 'live', label: 'Live' },
];

export function StudioScreen() {
  const { user, addPost, addDrop, showToast } = useStore();
  const [post, setPost] = useState('');
  const [postError, setPostError] = useState<string | null>(null);
  const [minPrice, setMinPrice] = useState<(typeof PALIERS)[number]>(0);
  const [dropTitle, setDropTitle] = useState('');
  const [dropError, setDropError] = useState<string | null>(null);
  const [kind, setKind] = useState<DropKind>('club');

  const publishPost = () => {
    const error = validateClubPost(post);
    if (error) {
      setPostError(error);
      hapticError();
      return;
    }
    addPost(post, minPrice);
    setPost('');
    setPostError(null);
    hapticSuccess();
    showToast(minPrice ? `Post Club dès ${minPrice} €` : 'Post public dans le Club');
  };

  const publishDrop = () => {
    const title = dropTitle.trim();
    if (title.length < 3) {
      setDropError('Au moins 3 caractères.');
      hapticError();
      return;
    }
    if (title.length > 80) {
      setDropError('80 caractères max.');
      hapticError();
      return;
    }
    addDrop({ title, kind });
    setDropTitle('');
    setDropError(null);
    hapticSuccess();
    showToast('Drop envoyé dans Pour toi');
  };

  return (
    <ScrollView
      style={styles.body}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <PressableScale
        style={styles.headerLeft}
        onPress={goBack}
        accessibilityRole="button"
        accessibilityLabel="Fermer l'atelier"
      >
        <Text style={styles.chevron}>‹</Text>
        <Text style={styles.brand}>Fermer</Text>
      </PressableScale>
      <FadeSlideIn>
        <Text style={styles.title}>Atelier</Text>
        <Text style={styles.empty}>
          Tu publies comme {user?.name ?? 'créateur'}. Les posts vont dans le Club (tous les comptes
          de l’appareil). Les drops apparaissent dans Pour toi.
        </Text>

        <Text style={styles.sectionTitle}>Post Club</Text>
        <View style={styles.chips}>
          {PALIERS.map((price) => {
            const active = minPrice === price;
            return (
              <PressableScale
                key={price}
                onPress={() => {
                  hapticSelect();
                  setMinPrice(price);
                }}
                contentStyle={[styles.chip, active && styles.chipActive]}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>
                  {price === 0 ? 'Public' : `${price} €`}
                </Text>
              </PressableScale>
            );
          })}
        </View>
        <View style={[styles.composer, postError && styles.composerError]}>
          <TextInput
            value={post}
            onChangeText={(value) => {
              setPost(value);
              if (postError) setPostError(null);
            }}
            placeholder="Annonce, teaser, fichier membre…"
            placeholderTextColor={colors.placeholder}
            style={styles.composerInput}
            multiline
            maxLength={240}
          />
          {postError ? <Text style={styles.fieldError}>{postError}</Text> : null}
          <Text style={[styles.followMeta, { alignSelf: 'flex-end' }]}>{post.trim().length}/240</Text>
          <PressableScale
            contentStyle={[styles.chip, styles.chipActive, { alignSelf: 'flex-end', marginTop: 8 }]}
            onPress={publishPost}
          >
            <Text style={[styles.chipText, styles.chipTextActive]}>Publier le post</Text>
          </PressableScale>
        </View>

        <Text style={[styles.sectionTitle, { marginTop: 18 }]}>Drop membres</Text>
        <View style={styles.chips}>
          {KINDS.map((item) => {
            const active = kind === item.id;
            return (
              <PressableScale
                key={item.id}
                onPress={() => {
                  hapticSelect();
                  setKind(item.id);
                }}
                contentStyle={[styles.chip, active && styles.chipActive]}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{item.label}</Text>
              </PressableScale>
            );
          })}
        </View>
        <View style={[styles.composer, dropError && styles.composerError]}>
          <TextInput
            value={dropTitle}
            onChangeText={(value) => {
              setDropTitle(value);
              if (dropError) setDropError(null);
            }}
            placeholder="Titre du drop ou du live"
            placeholderTextColor={colors.placeholder}
            style={styles.composerInput}
            maxLength={80}
          />
          {dropError ? <Text style={styles.fieldError}>{dropError}</Text> : null}
          <PressableScale
            contentStyle={[styles.chip, styles.chipActive, { alignSelf: 'flex-end', marginTop: 8 }]}
            onPress={publishDrop}
          >
            <Text style={[styles.chipText, styles.chipTextActive]}>Envoyer le drop</Text>
          </PressableScale>
        </View>
      </FadeSlideIn>
    </ScrollView>
  );
}
