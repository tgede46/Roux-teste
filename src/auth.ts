import * as Crypto from 'expo-crypto';

export async function hashSecret(email: string, password: string) {
  return Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    `${email.trim().toLowerCase()}:${password}:roux-sandbox`,
  );
}

export async function secretsMatch(email: string, password: string, stored: string) {
  const next = await hashSecret(email, password);
  return next === stored;
}
