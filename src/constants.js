// ─── constants.js ─────────────────────────────────────────────────────────────

export const STORAGE_KEY = 'flirtai_gemini_key'

export const SYSTEM_PROMPT = `Tu es FlirtAI, coach séduction direct et efficace.

RÈGLES ABSOLUES :
- Réponds en 3-5 phrases MAX au total
- Zéro blabla, zéro introduction, zéro conclusion
- Pas de "Bien sûr !", "Voici !", ou phrases de remplissage
- Commence directement par les messages
- Donne UNE SEULE réponse, le meilleur message possible
- Pas d'explication, pas de variantes, pas de commentaires
- Juste le message, prêt à copier-coller
- Pas de guillemets autour du message

Tu réponds en français uniquement.`

export const MODES = [
  { id: 'opener',  emoji: '✨', label: 'Premier message', desc: 'Accroche parfaite pour briser la glace' },
  { id: 'flirt',   emoji: '🔥', label: 'Flirter',         desc: 'Monter la tension et le désir' },
  { id: 'date',    emoji: '📍', label: 'Proposer un date', desc: 'Inviter naturellement sans paraître désespéré' },
  { id: 'reply',   emoji: '💬', label: 'Répondre',        desc: 'Réagir à un message reçu' },
  { id: 'relance', emoji: '🎯', label: 'Relancer',        desc: 'Recontacter après un silence' },
]

export const QUICK_PROMPTS = [
  "Elle aime la randonnée et les chats, on s'est vus au café",
  "Il m'a envoyé un meme, comment répondre en flirtant ?",
  "On s'est matchés hier, elle a une bio sur les voyages",
  "Pas de réponse depuis 3 jours, je veux relancer sans paraître insistant",
]
