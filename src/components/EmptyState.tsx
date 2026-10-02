import { Text, View } from 'react-native';
import { homeStyles as styles } from '../screens/homeStyles';
import { PressableScale } from './PressableScale';

type Props = {
  title: string;
  body: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({ title, body, actionLabel, onAction }: Props) {
  return (
    <View style={styles.emptyCard}>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.empty}>{body}</Text>
      {actionLabel && onAction ? (
        <PressableScale onPress={onAction} contentStyle={styles.primaryBtn}>
          <Text style={styles.primaryBtnText}>{actionLabel}</Text>
        </PressableScale>
      ) : null}
    </View>
  );
}
