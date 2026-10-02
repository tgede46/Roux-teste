import { useLocalSearchParams } from 'expo-router';
import { ProductScreen } from '@/screens/ProductScreen';

export default function ProductRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <ProductScreen productId={typeof id === 'string' ? id : id?.[0] ?? ''} />;
}
