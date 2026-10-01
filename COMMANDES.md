# Commandes utilisées pour créer le projet

Projet Expo (React Native) dans le dossier actuel, template TypeScript vide.

## Prérequis

```bash
node -v
npm -v
```

Versions utilisées :

- Node `v22.23.1`
- npm `10.9.8`

## Création du projet

Dans le dossier vide `/home/gedeonkp/Documents/projet/Kotlin` :

```bash
npx create-expo-app@latest . --template blank-typescript --yes
```

- `.` : crée l’app dans le dossier courant (pas un sous-dossier)
- `--template blank-typescript` : template Expo vide + TypeScript
- `--yes` : accepte les options par défaut (sans questions)

## Installation des dépendances

Si `node_modules` n’est pas encore là (création interrompue) :

```bash
npm install
```

## Lancer l’app

```bash
npx expo start
```

Autres scripts (`package.json`) :

```bash
npm start          # même chose que expo start
npm run android    # Expo + Android
npm run ios        # Expo + iOS
npm run web        # Expo + navigateur
```
