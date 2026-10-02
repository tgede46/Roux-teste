import { useLocalSearchParams } from 'expo-router';
import { ReaderScreen } from '@/screens/ReaderScreen';

export default function ReaderRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <ReaderScreen productId={typeof id === 'string' ? id : id?.[0] ?? ''} />;
}
