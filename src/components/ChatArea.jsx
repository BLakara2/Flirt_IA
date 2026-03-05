// ─── components/ChatArea.jsx ──────────────────────────────────────────────────

import { useState, useEffect, useRef } from 'react'
import { QUICK_PROMPTS } from '../constants.js'
import styles from './ChatArea.module.css'

function Message({ msg }) {
  const isUser = msg.role === "user"
  const [displayedText, setDisplayedText] = useState(isUser ? msg.content : "")

  useEffect(() => {
    if (isUser) return

    let index = 0
    const speed = 2

    const interval = setInterval(() => {
      setDisplayedText(msg.content.slice(0, index + 1))
      index++

      if (index >= msg.content.length) {
        clearInterval(interval)
      }
    }, speed)

    return () => clearInterval(interval)
  }, [msg.content, isUser])

  return (
    <div className={`${styles.message} ${isUser ? styles.user : styles.ai}`}>
      <div className={styles.avatar}>{isUser ? "😎" : "💘"}</div>

      <div className={styles.content}>
        <div className={styles.bubble} style={{ whiteSpace: "pre-wrap" }}>
          {displayedText}
        </div>

        <div className={styles.time}>{msg.time}</div>
      </div>
    </div>
  )
}


// ── TypingIndicator ───────────────────────────────────────────────────────────

function TypingIndicator() {
  return (
    <div className={`${styles.message} ${styles.ai}`}>
      <div className={styles.avatar}>💘</div>
      <div className={styles.content}>
        <div className={`${styles.bubble} ${styles.typing}`}>
          <span /><span /><span />
        </div>
      </div>
    </div>
  )
}

// ── ChatArea ──────────────────────────────────────────────────────────────────

export default function ChatArea({ messages, loading, onQuickPrompt }) {
  const ref = useRef(null)

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight
    }
  }, [messages, loading])

  return (
    <div className={styles.area} ref={ref}>
      {messages.length === 0 ? (
        <div className={styles.welcome}>
          <div className={styles.welcomeEmoji}>💘</div>
          <h2 className={styles.welcomeTitle}>Ton coach séduction IA</h2>
          <p className={styles.welcomeDesc}>
            Décris ta situation et je te crée des messages naturels,
            authentiques et efficaces. Aucun cliché, que du vrai.
          </p>
          <div className={styles.quickPrompts}>
            {QUICK_PROMPTS.map((q, i) => (
              <button key={i} className={styles.quickBtn} onClick={() => onQuickPrompt(q)}>
                {q}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <>
          {messages.map((msg, i) => (
            <Message key={i} msg={msg} />
          ))}
          {loading && <TypingIndicator />}
        </>
      )}
    </div>
  )
}
