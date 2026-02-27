# 💘 FlirtAI — Coach Séduction IA

Un assistant séduction propulsé par Claude d'Anthropic, avec support **offline (PWA)**.

## 🚀 Installation

```bash
# 1. Installer les dépendances
npm install

# 2. Lancer en développement
npm run dev

# 3. Build pour la production (avec PWA offline)
npm run build
npm run preview
```

## 📱 Installation sur mobile (PWA)

Après `npm run build && npm run preview` :

1. Ouvre l'URL dans Chrome/Safari sur ton téléphone
2. **Android** : Menu → "Ajouter à l'écran d'accueil"
3. **iOS** : Partager → "Sur l'écran d'accueil"

L'app fonctionne ensuite **hors ligne** (sans connexion internet) — tu as juste besoin d'une connexion pour envoyer des messages à l'IA.

## 🔑 Clé API

Obtiens ta clé sur [console.anthropic.com](https://console.anthropic.com).  
Elle est stockée **localement** sur ton appareil via `localStorage`.

## 🏗️ Structure

```
src/
├── components/
│   ├── ApiSetup.jsx      # Écran de saisie de la clé API
│   ├── Header.jsx        # En-tête avec actions
│   ├── ModeBar.jsx       # Sélecteur de mode de séduction
│   ├── ChatArea.jsx      # Zone de messages + écran d'accueil
│   └── InputBar.jsx      # Barre de saisie
├── hooks/
│   └── useChat.js        # Logique API + historique
├── constants.js          # Modes, prompts rapides, system prompt
├── App.jsx               # Composant racine
└── index.css             # Variables CSS globales + animations
```

## 🎯 Modes disponibles

| Mode | Description |
|------|-------------|
| 💬 Première approche | Message d'accroche |
| 🔥 Rizz intense | Niveau confiance max |
| 📱 Tinder / Insta | Reply DM |
| 🍷 Inviter en date | Proposer de se voir |
| 😅 Sauvetage | Après une gaffe |
| ✨ Compliment | Unique et mémorable |
