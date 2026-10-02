import { useEffect } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { FadeSlideIn } from '../components/FadeSlideIn';
import { FileContent } from '../components/FilePreview';
import { PressableScale } from '../components/PressableScale';
import { fileKindLabel, getProduct, getProductFile } from '../data';
import { useStore } from '../store';
import { homeStyles as styles } from './homeStyles';

type Props = {
  productId: string;
  onBack: () => void;
};

export function ReaderScreen({ productId, onBack }: Props) {
  const product = getProduct(productId);
  const file = getProductFile(productId);
  const { hasProductAccess, accessKind, markOpened } = useStore();

  useEffect(() => {
    if (product && hasProductAccess(product.id)) {
      markOpened(product.id);
    }
  }, [product, hasProductAccess, markOpened]);

  if (!product || !file || !hasProductAccess(product.id)) {
    return (
      <View style={styles.content}>
        <Text style={styles.empty}>Ce fichier n’est pas dans ta Library.</Text>
        <PressableScale onPress={onBack} contentStyle={styles.ghostBtn}>
          <Text style={styles.ghostBtnText}>Retour</Text>
        </PressableScale>
      </View>
    );
  }

  const source = accessKind(product.id);

  return (
    <ScrollView style={styles.body} contentContainerStyle={styles.content}>
      <PressableScale style={styles.headerLeft} onPress={onBack}>
        <Text style={styles.chevron}>‹</Text>
        <Text style={styles.brand}>Bibliothèque</Text>
      </PressableScale>
      <FadeSlideIn>
        <Text style={styles.followMeta}>
          {fileKindLabel(file.kind)} · {source === 'purchase' ? 'Achat' : 'Membre'}
        </Text>
        <Text style={styles.title}>{product.name}</Text>
        <FileContent product={product} file={file} />
        <Text style={[styles.followName, { marginTop: 16 }]}>{file.fileName}</Text>
        <Text style={[styles.detailBlurb, { marginTop: 8 }]}>{file.licence}</Text>
      </FadeSlideIn>
    </ScrollView>
  );
}
