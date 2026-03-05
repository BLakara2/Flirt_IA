// ─── hooks/useChat.js ─────────────────────────────────────────────────────────

import { useState, useCallback } from 'react'
import { MODES, SYSTEM_PROMPT } from '../constants.js'

const getTime = () =>
  new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })

// Gemini stream endpoint — note: streamGenerateContent + alt=sse
const GEMINI_URL = (key) =>
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:streamGenerateContent?alt=sse&key=${key}`

export function useChat(apiKey) {
  const [messages, setMessages]   = useState([])
  const [loading, setLoading]     = useState(false)
  const [streaming, setStreaming] = useState(false)

  const sendMessage = useCallback(async (text, mode) => {
    if (!text.trim() || loading || streaming) return

    const modeInfo  = MODES.find(m => m.id === mode)
    const userEntry = { role: 'user', content: text, time: getTime() }
    const snapshot  = [...messages, userEntry]

    setMessages(snapshot)
    setLoading(true)

    const enriched = `[Mode actif: ${modeInfo?.emoji} ${modeInfo?.label}]\n\n${text}`

    const contents = snapshot.map((m, i) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{
        text: i === snapshot.length - 1 && m.role === 'user' ? enriched : m.content,
      }],
    }))

    try {
      const res = await fetch(GEMINI_URL(apiKey), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents,
          generationConfig: { temperature: 0.9 },
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error?.message || `Erreur ${res.status}`)
      }

      // Insert empty assistant bubble immediately — fills in as chunks arrive
      const assistantEntry = { role: 'assistant', content: '', time: getTime() }
      setMessages(prev => [...prev, assistantEntry])
      setLoading(false)
      setStreaming(true)

      const reader  = res.body.getReader()
      const decoder = new TextDecoder()
      let accumulated = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const raw   = decoder.decode(value, { stream: true })
        const lines = raw.split('\n')

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const json = line.slice(6).trim()
          if (!json || json === '[DONE]') continue

          try {
            const parsed = JSON.parse(json)
            const chunk  = parsed.candidates?.[0]?.content?.parts?.[0]?.text || ''
            if (!chunk) continue

            accumulated += chunk

            setMessages(prev => {
              const updated = [...prev]
              updated[updated.length - 1] = {
                ...updated[updated.length - 1],
                content: accumulated,
              }
              return updated
            })
          } catch {
            // malformed chunk — skip
          }
        }
      }

      if (!accumulated) {
        setMessages(prev => {
          const updated = [...prev]
          updated[updated.length - 1] = { ...updated[updated.length - 1], content: 'Réponse vide.' }
          return updated
        })
      }

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

      setMessages(prev => {
        const last = prev[prev.length - 1]
        if (last?.role === 'assistant' && last.content === '') {
          const updated = [...prev]
          updated[updated.length - 1] = { ...last, content: msg }
          return updated
        }
        return [...prev, { role: 'assistant', content: msg, time: getTime() }]
      })
    } finally {
      setLoading(false)
      setStreaming(false)
    }
  }, [messages, loading, streaming, apiKey])

  const clearHistory = useCallback(() => setMessages([]), [])

  return { messages, loading, streaming, sendMessage, clearHistory }
}
