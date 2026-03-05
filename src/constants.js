// ─── constants.js ─────────────────────────────────────────────────────────────

export const STORAGE_KEY = 'flirtai_gemini_key'

export const SYSTEM_PROMPT = `Tu es FlirtAI, un coach séduction expert, bienveillant et naturel.
Tu aides les gens à créer des messages authentiques et efficaces pour leurs interactions romantiques.
Tu évites les clichés et les phrases toutes faites. Tu t'adaptes au contexte, au style de la personne et à sa cible.
Tu proposes toujours 2-3 variantes de messages, avec de courtes explications sur pourquoi ça fonctionne.
Tu es chaleureux, drôle quand c'est approprié, et toujours respectueux.
Tu réponds en français.`

export const MODES = [
  { id: 'opener',  emoji: '✨', label: 'Premier message', desc: 'Accroche parfaite pour briser la glace' },
  { id: 'flirt',   emoji: '🔥', label: 'Flirter',         desc: 'Monter la tension et le désir' },
  { id: 'date',    emoji: '📍', label: 'Proposer un date', desc: 'Inviter naturellement sans paraître désespéré' },
  { id: 'reply',   emoji: '💬', label: 'Répondre',        desc: 'Réagir à un message reçu' },
  { id: 'relance', emoji: '🎯', label: 'Relancer',        desc: 'Recontacter après un silence' },
]

export const QUICK_PROMPTS = [
  'Elle aime la randonnée et les chats, on s\'est vus au café',
  'Il m\'a envoyé un meme, comment répondre en flirtant ?',
  'On s\'est matchés hier, elle a une bio sur les voyages',
  'Pas de réponse depuis 3 jours, je veux relancer sans paraître insistant',
]
