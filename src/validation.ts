const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateName(value: string) {
  const name = value.trim();
  if (!name) return 'Indique ton prénom.';
  if (name.length < 2) return 'Au moins 2 lettres.';
  if (name.length > 40) return '40 caractères max.';
  if (!/^[A-Za-zÀ-ÿ][A-Za-zÀ-ÿ .'-]*$/.test(name)) return 'Utilise des lettres, pas de chiffres.';
  return null;
}

export function validateEmail(value: string) {
  const email = value.trim();
  if (!email) return 'L’email est obligatoire.';
  if (/\s/.test(email)) return 'Pas d’espace dans l’email.';
  if (!EMAIL_RE.test(email)) return 'Email invalide, ex. toi@roux.club';
  return null;
}

export function validatePassword(value: string) {
  if (!value) return 'Le mot de passe est obligatoire.';
  if (value.length < 6) return 'Au moins 6 caractères.';
  if (value.length > 64) return '64 caractères max.';
  if (!/[A-Za-z]/.test(value) || !/[0-9]/.test(value)) {
    return 'Mélange lettres et chiffres.';
  }
  return null;
}

export function validateClubPost(value: string) {
  const text = value.trim();
  if (!text) return 'Écris un message avant de publier.';
  if (text.length < 3) return 'Au moins 3 caractères.';
  if (text.length > 240) return '240 caractères max.';
  return null;
}
