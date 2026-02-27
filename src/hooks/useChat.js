import { useState, useCallback } from 'react'
import { SYSTEM_PROMPT, MODES } from '../constants.js'

const getTime = () =>
  new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })

export function useChat(apiKey) {
  const [messages, setMessages] = useState([])
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState(null)

  const sendMessage = useCallback(async (text, mode) => {
    if (!text.trim() || loading) return
    setError(null)

    const modeInfo  = MODES.find(m => m.id === mode)
    const userEntry = { role: 'user', content: text, time: getTime() }

    setMessages(prev => [...prev, userEntry])
    setLoading(true)

    // Build API history (inject mode context in latest message)
    const enriched = `[Mode actif: ${modeInfo?.emoji} ${modeInfo?.label}]\n\n${text}`

    const apiMessages = [...messages, userEntry].map((m, i, arr) => ({
      role: m.role === 'user' ? 'user' : 'assistant',
      content: i === arr.length - 1 && m.role === 'user' ? enriched : m.content,
    }))

    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: apiMessages,
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error?.message || `Erreur ${res.status}`)
      }

      const data  = await res.json()
      const reply = data.content?.[0]?.text || 'Réponse vide.'

      setMessages(prev => [...prev, { role: 'assistant', content: reply, time: getTime() }])
    } catch (e) {
      const msg = e.message?.includes('Failed to fetch')
        ? "Pas de connexion. Vérifie ton réseau ou ta clé API."
        : e.message || "Erreur inconnue."
      setError(msg)
      setMessages(prev => [...prev, { role: 'assistant', content: `❌ ${msg}`, time: getTime() }])
    } finally {
      setLoading(false)
    }
  }, [messages, loading, apiKey])

  const clearHistory = useCallback(() => setMessages([]), [])

  return { messages, loading, error, sendMessage, clearHistory }
}
