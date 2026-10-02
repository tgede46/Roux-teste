import * as Haptics from 'expo-haptics';

function run(fn: () => Promise<unknown>) {
  void fn().catch(() => undefined);
}

export function hapticSelect() {
  run(() => Haptics.selectionAsync());
}

export function hapticLight() {
  run(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light));
}

export function hapticSuccess() {
  run(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success));
}

export function hapticError() {
  run(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error));
}
