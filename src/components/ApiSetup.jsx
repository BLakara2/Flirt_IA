import { useState } from 'react'
import styles from './ApiSetup.module.css'

export default function ApiSetup({ onSubmit }) {
  const [value, setValue] = useState('')

  const handle = () => {
    const key = value.trim()
    if (key.startsWith('sk-ant-')) onSubmit(key)
    else alert('La clé doit commencer par sk-ant-…')
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        <div className={styles.icon}>🔑</div>
        <h2 className={styles.title}>Clé API Anthropic</h2>
        <p className={styles.desc}>
          Entre ta clé API pour activer FlirtAI. Elle est stockée <strong>uniquement sur ton appareil</strong> et jamais partagée.
        </p>
        <input
          className={styles.input}
          type="password"
          placeholder="sk-ant-api03-…"
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
          Obtiens ta clé gratuitement sur{' '}
          <a href="https://console.anthropic.com" target="_blank" rel="noreferrer">
            console.anthropic.com
          </a>
        </p>
      </div>
    </div>
  )
}
