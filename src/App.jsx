// ─── App.jsx ──────────────────────────────────────────────────────────────────

import { useState, useCallback } from 'react'
import { STORAGE_KEY }   from './constants.js'
import { useChat }       from './hooks/useChat.js'
import ApiSetup          from './components/ApiSetup.jsx'
import Header            from './components/Header.jsx'
import ModeBar           from './components/ModeBar.jsx'
import ChatArea          from './components/ChatArea.jsx'
import InputBar          from './components/InputBar.jsx'
import QuotaOverlay      from './components/QuotaOverlay.jsx'
import styles            from './App.module.css'

export default function App() {
  const [apiKey, setApiKey] = useState(() => {
    try { return localStorage.getItem(STORAGE_KEY) || '' } catch { return '' }
  })
  const [mode, setMode] = useState('opener')

  const { messages, loading, streaming, quotaCooldown, sendMessage, clearHistory } = useChat(apiKey)

  const handleApiKey = useCallback((key) => {
    try { localStorage.setItem(STORAGE_KEY, key) } catch {}
    setApiKey(key)
  }, [])

  const handleLogout = useCallback(() => {
    try { localStorage.removeItem(STORAGE_KEY) } catch {}
    setApiKey('')
    clearHistory()
  }, [clearHistory])

  const handleSend = useCallback((text) => {
    sendMessage(text, mode)
  }, [sendMessage, mode])

  return (
    <div className={styles.shell}>
      <Header
        onLogout={handleLogout}
        onClear={clearHistory}
        hasMessages={messages.length > 0}
      />

      {!apiKey ? (
        <ApiSetup onSubmit={handleApiKey} />
      ) : (
        /* wrapper position:relative so overlay fills only this zone */
        <div className={styles.chatZone}>
          <ModeBar active={mode} onChange={setMode} />
          <ChatArea
            messages={messages}
            loading={loading}
            streaming={streaming}
            onQuickPrompt={handleSend}
          />
          <InputBar
            onSend={handleSend}
            loading={loading || streaming || quotaCooldown > 0}
            mode={mode}
          />
          <QuotaOverlay seconds={quotaCooldown} />
        </div>
      )}
    </div>
  )
}
