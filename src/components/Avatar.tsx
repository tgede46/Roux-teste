import { Image, View, type ImageSourcePropType, type StyleProp, type ViewStyle } from 'react-native';
import { homeStyles as styles } from '../screens/homeStyles';

type Props = {
  photo?: ImageSourcePropType;
  color: string;
  size?: 'sm' | 'lg';
  style?: StyleProp<ViewStyle>;
};

export function Avatar({ photo, color, size = 'sm', style }: Props) {
  const box = size === 'lg' ? styles.profileAvatar : styles.avatar;
  return (
    <View style={[box, { backgroundColor: color, overflow: 'hidden' }, style]}>
      {photo ? <Image source={photo} style={styles.photoFill} resizeMode="cover" /> : null}
    </View>
  );
}
