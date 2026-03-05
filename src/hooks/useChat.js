// ─── hooks/useChat.js ─────────────────────────────────────────────────────────

import { useState, useCallback } from 'react'
import { MODES, SYSTEM_PROMPT } from '../constants.js'

const getTime = () =>
  new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })

export function useChat(apiKey) {
  const [messages, setMessages] = useState([])
  const [loading, setLoading]   = useState(false)

  const sendMessage = useCallback(async (text, mode) => {
    if (!text.trim() || loading) return

    const modeInfo  = MODES.find(m => m.id === mode)
    const userEntry = { role: 'user', content: text, time: getTime() }
    const snapshot  = [...messages, userEntry]

    setMessages(snapshot)
    setLoading(true)

    // Inject mode context in the last user message
    const enriched = `[Mode actif: ${modeInfo?.emoji} ${modeInfo?.label}]\n\n${text}`

    // Gemini expects role "user" | "model" and a parts array
    const contents = snapshot.map((m, i) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [
        {
          text:
            i === snapshot.length - 1 && m.role === 'user'
              ? enriched
              : m.content,
        },
      ],
    }))

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
            contents,
            generationConfig: { temperature: 0.9 },
          }),
        }
      )

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error?.message || `Erreur ${res.status}`)
      }

      const data  = await res.json()
      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Réponse vide.'

      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: reply, time: getTime() },
      ])
    } catch (e) {
      const raw = e.message || ''
      let msg

      if (raw.includes('Failed to fetch') || raw.includes('NetworkError')) {
        msg = '📡 Pas de connexion. Vérifie ton réseau et réessaie.'
      } else if (raw.includes('quota') || raw.includes('RESOURCE_EXHAUSTED') || raw.includes('429')) {
        msg = '⏳ Quota Gemini atteint. Attends 1 minute puis réessaie.\n\nAstuce : le quota gratuit se réinitialise toutes les minutes.'
      } else if (raw.includes('API_KEY_INVALID') || raw.includes('400') || raw.includes('403')) {
        msg = '🔑 Clé API invalide. Clique sur 🔑 en haut à droite pour entrer une nouvelle clé.\n\nObtiens-en une gratuitement sur aistudio.google.com/apikey'
      } else if (raw.includes('SAFETY')) {
        msg = '🛡️ Gemini a bloqué ce message pour raisons de sécurité. Reformule ta demande différemment.'
      } else {
        msg = `❓ Erreur inattendue : ${raw || 'inconnue'}`
      }

      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: msg, time: getTime() },
      ])
    } finally {
      setLoading(false)
    }
  }, [messages, loading, apiKey])

  const clearHistory = useCallback(() => setMessages([]), [])

  return { messages, loading, sendMessage, clearHistory }
}
