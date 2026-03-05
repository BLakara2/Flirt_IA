// ─── components/Header.jsx ────────────────────────────────────────────────────

import styles from './Header.module.css'

export default function Header({ onLogout, onClear, hasMessages }) {
  return (
    <header className={styles.header}>
      <div className={styles.avatar}>💘</div>

      <div className={styles.info}>
        <h1 className={styles.title}>
          Flirt<span>AI</span>
        </h1>
        <p className={styles.sub}>
          <span className={styles.dot} />
          Coach Séduction ·&nbsp;
          <span className={styles.powered}>Gemini 2.5 Flash</span>
        </p>
      </div>

      <div className={styles.actions}>
        {hasMessages && (
          <button className={styles.btn} onClick={onClear} title="Nouvelle conversation">
            🗑️
          </button>
        )}
        <button className={styles.btn} onClick={onLogout} title="Changer de clé API">
          🔑
        </button>
      </div>
    </header>
  )
}
