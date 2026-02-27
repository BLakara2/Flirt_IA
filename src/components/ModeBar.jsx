import { MODES } from '../constants.js'
import styles from './ModeBar.module.css'

export default function ModeBar({ active, onChange }) {
  return (
    <nav className={styles.bar}>
      {MODES.map(m => (
        <button
          key={m.id}
          className={`${styles.btn} ${active === m.id ? styles.active : ''}`}
          onClick={() => onChange(m.id)}
          title={m.desc}
        >
          {m.emoji} {m.label}
        </button>
      ))}
    </nav>
  )
}
