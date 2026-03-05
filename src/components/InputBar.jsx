// ─── components/InputBar.jsx ──────────────────────────────────────────────────

import { useState, useRef } from 'react'
import { MODES } from '../constants.js'
import styles from './InputBar.module.css'

export default function InputBar({ onSend, loading, mode }) {
  const [value, setValue] = useState('')
  const ref = useRef(null)

  const send = () => {
    if (!value.trim() || loading) return
    onSend(value.trim())
    setValue('')
    if (ref.current) {
      ref.current.style.height = 'auto'
    }
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  const handleChange = (e) => {
    setValue(e.target.value)
    const el = ref.current
    if (el) {
      el.style.height = 'auto'
      el.style.height = Math.min(el.scrollHeight, 120) + 'px'
    }
  }

  const activeMode = MODES.find(m => m.id === mode)

  return (
    <div className={styles.bar}>
      <div className={styles.row}>
        <textarea
          ref={ref}
          className={styles.textarea}
          placeholder="Décris la situation, son profil, le contexte…"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKey}
          rows={1}
        />
        <button
          className={styles.sendBtn}
          onClick={send}
          disabled={loading || !value.trim()}
          aria-label="Envoyer"
        >
          {loading ? '⏳' : '🚀'}
        </button>
      </div>
      <p className={styles.hint}>
        ↵ pour envoyer · Mode : <span>{activeMode?.emoji} {activeMode?.label}</span>
      </p>
    </div>
  )
}
