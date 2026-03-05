// ─── components/QuotaOverlay.jsx ─────────────────────────────────────────────

import styles from './QuotaOverlay.module.css'

// Petit personnage SVG animé qui attend
function StickFigure({ delay = 0, action = 'walk' }) {
  return (
    <svg
      className={`${styles.figure} ${styles[action]}`}
      style={{ animationDelay: `${delay}s` }}
      viewBox="0 0 40 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Tête */}
      <circle cx="20" cy="10" r="7" stroke="currentColor" strokeWidth="2.5" fill="none"/>
      {/* Corps */}
      <line x1="20" y1="17" x2="20" y2="38" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
      {/* Bras gauche */}
      <line x1="20" y1="24" x2="8" y2="32" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
        className={styles.armLeft}/>
      {/* Bras droit */}
      <line x1="20" y1="24" x2="32" y2="32" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
        className={styles.armRight}/>
      {/* Jambe gauche */}
      <line x1="20" y1="38" x2="10" y2="54" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
        className={styles.legLeft}/>
      {/* Jambe droite */}
      <line x1="20" y1="38" x2="30" y2="54" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
        className={styles.legRight}/>
    </svg>
  )
}

// Horloge SVG animée
function Clock({ seconds }) {
  const angle = (seconds / 60) * 360
  const rad   = (angle - 90) * (Math.PI / 180)
  const x     = 16 + 10 * Math.cos(rad)
  const y     = 16 + 10 * Math.sin(rad)

  return (
    <svg viewBox="0 0 32 32" className={styles.clock} xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="2" fill="none"/>
      <line x1="16" y1="16" x2={x} y2={y}
        stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="16" cy="16" r="2" fill="currentColor"/>
    </svg>
  )
}

export default function QuotaOverlay({ seconds }) {
  if (seconds <= 0) return null

  const msgs = [
    'En train de recharger les superpouvoirs…',
    'Le serveur reprend son souffle…',
    'Presque prêt à te trouver la réplique parfaite…',
    'Patiente encore un instant…',
  ]
  const msg = msgs[Math.floor((60 - seconds) / 15) % msgs.length]

  return (
    <div className={styles.overlay}>
      <div className={styles.card}>

        {/* Scène animée */}
        <div className={styles.scene}>
          {/* Sol */}
          <div className={styles.ground} />

          {/* Figurines */}
          <StickFigure delay={0}   action="walk" />
          <StickFigure delay={0.3} action="walk" />
          <StickFigure delay={0.6} action="jump" />

          {/* Horloge flottante */}
          <div className={styles.clockWrap}>
            <Clock seconds={seconds} />
          </div>
        </div>

        {/* Countdown */}
        <div className={styles.countdown}>
          <span className={styles.countNum}>{seconds}</span>
          <span className={styles.countLabel}>secondes</span>
        </div>

        <p className={styles.msg}>{msg}</p>
        <p className={styles.sub}>Quota Gemini atteint — reprise automatique</p>
      </div>
    </div>
  )
}
