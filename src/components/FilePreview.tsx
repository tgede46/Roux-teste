import { useEffect } from 'react';
import { Image, Text, View, type ImageSourcePropType } from 'react-native';
import { setAudioModeAsync, useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { useEvent } from 'expo';
import { useVideoPlayer, VideoView } from 'expo-video';
import type { Product, ProductFile } from '../data';
import { hapticSelect } from '../haptics';
import { homeStyles as styles } from '../screens/homeStyles';
import { PressableScale } from './PressableScale';

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const total = Math.floor(seconds);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function VideoPreview({ uri }: { uri: string }) {
  const player = useVideoPlayer(uri, (next) => {
    next.loop = false;
  });
  const { isPlaying } = useEvent(player, 'playingChange', { isPlaying: player.playing });

  useEffect(() => {
    return () => player.pause();
  }, [player]);

  return (
    <View>
      <VideoView
        player={player}
        style={styles.mediaStage}
        contentFit="contain"
        nativeControls
        fullscreenOptions={{ enable: true }}
        accessibilityLabel="Lecteur vidéo"
      />
      <PressableScale
        contentStyle={[styles.primaryBtn, { marginTop: 12 }]}
        onPress={() => {
          hapticSelect();
          if (isPlaying) player.pause();
          else player.play();
        }}
      >
        <Text style={styles.primaryBtnText}>{isPlaying ? 'Pause' : 'Lire la vidéo'}</Text>
      </PressableScale>
    </View>
  );
}

export function AudioPreview({ uri, artwork }: { uri: string; artwork?: ImageSourcePropType }) {
  const player = useAudioPlayer(uri);
  const status = useAudioPlayerStatus(player);

  useEffect(() => {
    void setAudioModeAsync({ playsInSilentMode: true });
    return () => player.pause();
  }, [player]);

  return (
    <View>
      {artwork ? <Image source={artwork} style={styles.mediaStage} resizeMode="cover" /> : null}
      <Text style={[styles.followMeta, { marginTop: 10 }]}>
        {formatTime(status.currentTime)} / {formatTime(status.duration)}
      </Text>
      <PressableScale
        contentStyle={[styles.primaryBtn, { marginTop: 12 }]}
        onPress={() => {
          hapticSelect();
          if (status.playing) player.pause();
          else player.play();
        }}
      >
        <Text style={styles.primaryBtnText}>{status.playing ? 'Pause' : 'Écouter'}</Text>
      </PressableScale>
    </View>
  );
}

export function DocumentPages({ pages }: { pages: ImageSourcePropType[] }) {
  return (
    <View>
      {pages.map((page, index) => (
        <View key={index} style={styles.docPage}>
          <Text style={styles.docPageLabel}>
            Page {index + 1} / {pages.length}
          </Text>
          <Image source={page} style={styles.docPageImage} resizeMode="contain" />
        </View>
      ))}
    </View>
  );
}

export function FileContent({ product, file }: { product: Product; file: ProductFile }) {
  const pages = file.pages?.length ? file.pages : [product.image];

  if (file.kind === 'video' && file.mediaUri) {
    return <VideoPreview uri={file.mediaUri} />;
  }
  if (file.kind === 'audio' && file.mediaUri) {
    return <AudioPreview uri={file.mediaUri} artwork={pages[0]} />;
  }
  return <DocumentPages pages={pages} />;
}
