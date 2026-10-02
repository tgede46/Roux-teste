import { useLocalSearchParams } from 'expo-router';
import { CreatorScreen } from '@/screens/CreatorScreen';

export default function CreatorRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <CreatorScreen creatorId={typeof id === 'string' ? id : id?.[0] ?? ''} />;
}
