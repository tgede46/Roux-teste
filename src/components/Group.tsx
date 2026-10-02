import { Children, Fragment, type ReactNode } from 'react';
import { View } from 'react-native';
import { homeStyles as styles } from '../screens/homeStyles';

type Props = {
  children: ReactNode;
  inset?: number;
};

export function Group({ children, inset = 16 }: Props) {
  const items = Children.toArray(children).filter(Boolean);
  return (
    <View style={styles.group}>
      {items.map((child, index) => (
        <Fragment key={index}>
          {child}
          {index < items.length - 1 ? (
            <View style={[styles.groupSeparator, { marginLeft: inset }]} />
          ) : null}
        </Fragment>
      ))}
    </View>
  );
}
