// ─── components/ChatArea.jsx ──────────────────────────────────────────────────

import { useEffect, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import { QUICK_PROMPTS } from '../constants.js'
import styles from './ChatArea.module.css'

// ── Message ───────────────────────────────────────────────────────────────────

function Message({ msg, streaming }) {
  const isUser = msg.role === 'user'

  return (
    <div className={`${styles.message} ${isUser ? styles.user : styles.ai}`}>
      <div className={styles.avatar}>{isUser ? '😎' : '💘'}</div>
      <div className={styles.content}>
        <div className={styles.bubble}>
          {isUser ? (
            // User messages: plain text
            <span style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</span>
          ) : (
            // AI messages: rendered Markdown
            <div className={styles.markdown}>
              <ReactMarkdown>{msg.content}</ReactMarkdown>
              {streaming && <span className={styles.cursor} />}
            </div>
          )}
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

export default function ChatArea({ messages, loading, streaming, onQuickPrompt }) {
  const ref = useRef(null)

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight
    }
  }, [messages, loading])

  const lastIsStreaming = streaming && messages.length > 0 &&
    messages[messages.length - 1].role === 'assistant'

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
            <Message
              key={i}
              msg={msg}
              streaming={lastIsStreaming && i === messages.length - 1}
            />
          ))}
          {loading && <TypingIndicator />}
        </>
      )}
    </div>
  )
}
