import { useState, useCallback } from 'react'
import ApiSetup from './components/ApiSetup.jsx'
import Header   from './components/Header.jsx'
import ModeBar  from './components/ModeBar.jsx'
import ChatArea from './components/ChatArea.jsx'
import InputBar from './components/InputBar.jsx'
import { useChat } from './hooks/useChat.js'
import styles from './App.module.css'

const STORAGE_KEY = 'flirt_api_key'

export default function App() {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem(STORAGE_KEY) || '')
  const [mode, setMode]     = useState('opener')

  const { messages, loading, sendMessage, clearHistory } = useChat(apiKey)

  const handleApiKey = useCallback((key) => {
    localStorage.setItem(STORAGE_KEY, key)
    setApiKey(key)
  }, [])

  const handleLogout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setApiKey('')
    clearHistory()
  }, [clearHistory])

  const handleSend = useCallback((text) => {
    sendMessage(text, mode)
  }, [sendMessage, mode])

  if (!apiKey) {
    return (
      <div className={styles.shell}>
        <Header onLogout={() => {}} onClear={() => {}} hasMessages={false} />
        <ApiSetup onSubmit={handleApiKey} />
      </div>
    )
  }

  return (
    <div className={styles.shell}>
      <Header
        onLogout={handleLogout}
        onClear={clearHistory}
        hasMessages={messages.length > 0}
      />
      <ModeBar active={mode} onChange={setMode} />
      <ChatArea
        messages={messages}
        loading={loading}
        onQuickPrompt={handleSend}
      />
      <InputBar onSend={handleSend} loading={loading} mode={mode} />
    </div>
  )
}
