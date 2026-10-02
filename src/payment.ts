export type ChargeOk = {
  ok: true;
  last4: string;
  brand: string;
};

export type ChargeFail = {
  ok: false;
  error: string;
};

export type ChargeResult = ChargeOk | ChargeFail;

export function digitsOnly(value: string) {
  return value.replace(/\D/g, '');
}

export function formatCard(value: string) {
  return digitsOnly(value)
    .slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, '$1 ');
}

export function formatExpiry(value: string) {
  const digits = digitsOnly(value).slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

export function brandFromPan(pan: string) {
  if (pan.startsWith('4')) return 'Visa';
  if (pan.startsWith('5')) return 'Mastercard';
  if (pan.startsWith('3')) return 'Amex';
  return 'Carte';
}

export function chargeSandbox(card: string, expiry: string, cvc: string): ChargeResult {
  const pan = digitsOnly(card);
  const exp = digitsOnly(expiry);
  const cv = digitsOnly(cvc);

  if (pan.length < 16) return { ok: false, error: 'Numéro : 16 chiffres.' };
  if (exp.length !== 4) return { ok: false, error: 'Expiration MM/AA.' };
  const month = Number(exp.slice(0, 2));
  if (month < 1 || month > 12) return { ok: false, error: 'Mois d’expiration invalide.' };
  if (cv.length < 3) return { ok: false, error: 'CVC à 3 chiffres.' };

  if (pan === '4000000000000002') {
    return { ok: false, error: 'Carte refusée (sandbox 0002).' };
  }
  if (pan === '4000000000009995') {
    return { ok: false, error: 'Fonds insuffisants (sandbox 9995).' };
  }
  if (pan === '4242424242424242' || pan === '5555555555554444') {
    return { ok: true, last4: pan.slice(-4), brand: brandFromPan(pan) };
  }
  return { ok: false, error: 'Sandbox : utilise 4242 4242 4242 4242.' };
}

export function chargeWallet(): ChargeOk {
  return { ok: true, last4: '4242', brand: 'Wallet' };
}
