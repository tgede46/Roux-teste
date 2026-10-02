import { Link, Stack } from 'expo-router';
import { Text, View } from 'react-native';
import { colors } from '@/theme';

export default function NotFound() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background }}>
      <Stack.Screen options={{ headerShown: false }} />
      <Text style={{ fontSize: 18, marginBottom: 12 }}>Page introuvable</Text>
      <Link href="/">Retour à Roux</Link>
    </View>
  );
}
