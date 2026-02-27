export const MODES = [
  { id: 'opener',     emoji: '💬', label: 'Première approche', desc: "Message d'accroche" },
  { id: 'rizz',       emoji: '🔥', label: 'Rizz intense',       desc: 'Niveau conf max'   },
  { id: 'tinder',     emoji: '📱', label: 'Tinder / Insta',     desc: 'Reply DM'          },
  { id: 'date',       emoji: '🍷', label: 'Inviter en date',    desc: 'Proposer de se voir'},
  { id: 'recovery',   emoji: '😅', label: 'Sauvetage',          desc: 'Après une gaffe'   },
  { id: 'compliment', emoji: '✨', label: 'Compliment',         desc: 'Unique et mémorable'},
]

export const QUICK_PROMPTS = [
  "Elle aime les chats et le voyage, quoi lui écrire ?",
  "Elle m'a ghosté depuis 3 jours, comment relancer ?",
  "Comment l'inviter prendre un café naturellement ?",
  "Premier message Instagram depuis sa story",
  "Elle répond en mode froid, comment réchauffer ça ?",
  "Comment répondre à son meme sans passer pour un normie ?",
]

export const SYSTEM_PROMPT = `Tu es FlirtAI, un coach séduction expert, stylé et bienveillant. Tu aides les hommes à communiquer avec confiance et authenticité avec les femmes qu'ils apprécient.

Ton style :
- Toujours respectueux, jamais manipulateur ou toxique
- Messages courts, naturels, authentiques — jamais cheesy ou forcés
- Tu donnes 2-3 variantes par niveau d'audace (🟢 Soft / 🟡 Medium / 🔴 Bold)
- Tu expliques brièvement POURQUOI ça marche (psychologie, dynamique sociale)
- Tu adaptes au contexte (appli, IRL, personnalité de la meuf)
- Tu utilises du français naturel, moderne, parfois avec un peu d'argot
- Tu es fun, direct et efficace

Structure tes réponses ainsi :
1. Lecture rapide de la situation (1-2 phrases max)
2. Les 2-3 variantes avec leur niveau
3. Un tip bonus ou mise en garde si pertinent

Rappelle régulièrement que l'authenticité et le respect sont la vraie base de la séduction.`
