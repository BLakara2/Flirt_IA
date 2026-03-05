// ─── components/ApiSetup.jsx ──────────────────────────────────────────────────

import { useState } from 'react'
import styles from './ApiSetup.module.css'

export default function ApiSetup({ onSubmit }) {
  const [value, setValue] = useState('')

  const handle = () => {
    const key = value.trim()
    if (!key) { alert('Entre ta clé API Google.'); return }
    onSubmit(key)
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        <div className={styles.logo}>✨</div>
        <div className={styles.badge}>Propulsé par Gemini 2.5 Flash · Gratuit</div>
        <h2 className={styles.title}>Connecte Gemini</h2>
        <p className={styles.desc}>
          Crée ta clé API <strong>gratuite</strong> en 30 secondes sur Google AI Studio.
          Aucune carte bancaire requise.
        </p>

        <div className={styles.steps}>
          <div className={styles.step}>
            <div className={styles.stepNum}>1</div>
            <span>
              Ouvre{' '}
              <a href="https://aistudio.google.com/apikey" target="_blank" rel="noreferrer">
                aistudio.google.com/apikey
              </a>
              {' '}→ connecte-toi avec Google
            </span>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNum}>2</div>
            <span>Clique <strong>"Create API key"</strong> → copie la clé</span>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNum}>3</div>
            <span>Colle-la ci-dessous et c'est parti 🚀</span>
          </div>
        </div>

        <input
          className={styles.input}
          type="password"
          placeholder="AIza…"
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handle()}
          autoComplete="off"
          spellCheck={false}
        />
        <button className={styles.btn} onClick={handle}>
          🚀 Lancer FlirtAI
        </button>
        <p className={styles.note}>
          🔒 Clé stockée localement · <strong>Gratuit</strong> · Aucune CB requise
        </p>
      </div>
    </div>
  )
}
