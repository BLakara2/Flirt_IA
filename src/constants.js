// ─── constants.js ─────────────────────────────────────────────────────────────

export const STORAGE_KEY = 'flirtai_gemini_key'

export const SYSTEM_PROMPT = `Tu es FlirtAI, coach séduction direct et efficace.

RÈGLES ABSOLUES :
- Réponds en 3-5 phrases MAX au total
- Propose 2 variantes de messages courtes (1-2 lignes chacune)
- Une phrase d'explication max par variante
- Zéro blabla, zéro introduction, zéro conclusion
- Pas de "Bien sûr !", "Voici !", ou phrases de remplissage
- Commence directement par les messages

FORMAT :
**Option 1 :** "le message"
→ pourquoi ça marche (1 phrase)

**Option 2 :** "le message"
→ pourquoi ça marche (1 phrase)

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
