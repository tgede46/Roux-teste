import { useState } from 'react';
import { ActivityIndicator, Modal, Pressable, Text, TextInput, View } from 'react-native';
import { chargeSandbox, chargeWallet, formatCard, formatExpiry, type ChargeOk } from '../payment';
import { hapticError } from '../haptics';
import { colors } from '../theme';
import { homeStyles as styles } from '../screens/homeStyles';
import { PressableScale } from './PressableScale';

type Props = {
  visible: boolean;
  title: string;
  subtitle: string;
  amountLabel: string;
  busy: boolean;
  onClose: () => void;
  onPaid: (charge: ChargeOk) => void;
};

export function CheckoutSheet({
  visible,
  title,
  subtitle,
  amountLabel,
  busy,
  onClose,
  onPaid,
}: Props) {
  const [card, setCard] = useState('4242 4242 4242 4242');
  const [expiry, setExpiry] = useState('12/28');
  const [cvc, setCvc] = useState('123');
  const [error, setError] = useState<string | null>(null);

  const close = () => {
    if (busy) return;
    setError(null);
    onClose();
  };

  const payCard = () => {
    const result = chargeSandbox(card, expiry, cvc);
    if (!result.ok) {
      setError(result.error);
      hapticError();
      return;
    }
    setError(null);
    onPaid(result);
  };

  const payWallet = () => {
    setError(null);
    onPaid(chargeWallet());
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={close}>
      <View style={styles.modalBackdrop}>
        <Pressable style={{ flex: 1 }} onPress={close} />
        <View style={styles.sheet}>
          <Text style={styles.sectionTitle}>{title}</Text>
          <Text style={styles.detailBlurb}>{subtitle}</Text>
          <Text style={styles.followMeta}>Sandbox Stripe · 4242…4242 OK · 4000…0002 refusée</Text>
          <TextInput
            value={card}
            onChangeText={(value) => {
              setCard(formatCard(value));
              setError(null);
            }}
            placeholder="Numéro de carte"
            placeholderTextColor={colors.placeholder}
            keyboardType="number-pad"
            style={styles.payInput}
            maxLength={19}
          />
          <View style={styles.payRow}>
            <TextInput
              value={expiry}
              onChangeText={(value) => {
                setExpiry(formatExpiry(value));
                setError(null);
              }}
              placeholder="MM/AA"
              placeholderTextColor={colors.placeholder}
              keyboardType="number-pad"
              style={[styles.payInput, styles.payInputHalf]}
              maxLength={5}
            />
            <TextInput
              value={cvc}
              onChangeText={(value) => {
                setCvc(value.replace(/\D/g, '').slice(0, 4));
                setError(null);
              }}
              placeholder="CVC"
              placeholderTextColor={colors.placeholder}
              keyboardType="number-pad"
              style={[styles.payInput, styles.payInputHalf]}
              maxLength={4}
              secureTextEntry
            />
          </View>
          {error ? <Text style={styles.fieldError}>{error}</Text> : null}
          <PressableScale contentStyle={styles.primaryBtn} onPress={payCard} disabled={busy}>
            {busy ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryBtnText}>{amountLabel}</Text>}
          </PressableScale>
          <PressableScale
            contentStyle={[styles.ghostBtn, { marginTop: 10 }]}
            onPress={payWallet}
            disabled={busy}
          >
            <Text style={styles.ghostBtnText}>Apple / Google Pay (sandbox)</Text>
          </PressableScale>
          <PressableScale contentStyle={[styles.ghostBtn, { marginTop: 10 }]} onPress={close} disabled={busy}>
            <Text style={styles.ghostBtnText}>Annuler</Text>
          </PressableScale>
        </View>
      </View>
    </Modal>
  );
}
