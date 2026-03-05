// ─── hooks/useChat.js ─────────────────────────────────────────────────────────

import { useState, useCallback, useRef } from 'react'
import { MODES, SYSTEM_PROMPT } from '../constants.js'

const getTime = () =>
  new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })

const GEMINI_URL = (key) =>
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-04-17:streamGenerateContent?alt=sse&key=${key}`

export function useChat(apiKey) {
  const [messages, setMessages]       = useState([])
  const [loading, setLoading]         = useState(false)
  const [streaming, setStreaming]     = useState(false)
  const [quotaCooldown, setQuota]     = useState(0)   // countdown seconds, 0 = no cooldown
  const timerRef = useRef(null)

  const startCooldown = useCallback((seconds = 60) => {
    setQuota(seconds)
    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setQuota(prev => {
        if (prev <= 1) { clearInterval(timerRef.current); return 0 }
        return prev - 1
      })
    }, 1000)
  }, [])

  const sendMessage = useCallback(async (text, mode) => {
    if (!text.trim() || loading || streaming || quotaCooldown > 0) return

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
          generationConfig: { maxOutputTokens: 400, temperature: 0.9 },
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        const errMsg = err.error?.message || ''
        // Extract retry delay from Gemini error if present
        const retryMatch = errMsg.match(/retry.*?(\d+(?:\.\d+)?)s/i)
        const waitSecs = retryMatch ? Math.ceil(parseFloat(retryMatch[1])) + 2 : 62
        if (res.status === 429 || errMsg.toLowerCase().includes('quota') || errMsg.toLowerCase().includes('resource_exhausted')) {
          startCooldown(waitSecs)
          throw new Error('QUOTA')
        }
        throw new Error(errMsg || `Erreur ${res.status}`)
      }

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
              updated[updated.length - 1] = { ...updated[updated.length - 1], content: accumulated }
              return updated
            })
          } catch { /* skip malformed chunk */ }
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

      if (raw === 'QUOTA') {
        // Quota error — no message bubble, the overlay handles it
        setMessages(prev => prev.filter(m => !(m.role === 'assistant' && m.content === '')))
      } else if (raw.includes('Failed to fetch') || raw.includes('NetworkError')) {
        msg = '📡 Pas de connexion. Vérifie ton réseau et réessaie.'
      } else if (raw.includes('API_KEY_INVALID') || raw.includes('400') || raw.includes('403')) {
        msg = '🔑 Clé API invalide. Clique sur 🔑 en haut à droite pour en entrer une nouvelle.\n\nObtiens-en une gratuitement sur aistudio.google.com/apikey'
      } else if (raw.includes('SAFETY')) {
        msg = '🛡️ Message bloqué par Gemini. Reformule ta demande.'
      } else {
        msg = `❓ Erreur : ${raw || 'inconnue'}`
      }

      if (msg) {
        setMessages(prev => {
          const last = prev[prev.length - 1]
          if (last?.role === 'assistant' && last.content === '') {
            const updated = [...prev]
            updated[updated.length - 1] = { ...last, content: msg }
            return updated
          }
          return [...prev, { role: 'assistant', content: msg, time: getTime() }]
        })
      }
    } finally {
      setLoading(false)
      setStreaming(false)
    }
  }, [messages, loading, streaming, quotaCooldown, apiKey, startCooldown])

  const clearHistory = useCallback(() => setMessages([]), [])

  return { messages, loading, streaming, quotaCooldown, sendMessage, clearHistory }
}
