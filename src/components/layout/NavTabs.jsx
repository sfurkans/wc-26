import { NavLink } from 'react-router-dom'

const TABS = [
  { to: '/', label: 'Gruplar', icon: '🏟️', end: true },
  { to: '/maclar', label: 'Maçlar', icon: '⚽' },
  { to: '/puan-durumu', label: 'Puan Durumu', icon: '📊' },
  { to: '/eleme', label: 'Eleme', icon: '🏆' },
  { to: '/istatistikler', label: 'İstatistikler', icon: '📈' },
  { to: '/genel', label: 'Genel Veriler', icon: '💎' },
]

export default function NavTabs() {
  return (
    <nav className="navtabs">
      {TABS.map((t) => (
        <NavLink key={t.to} to={t.to} end={t.end} className="navtab">
          <span className="navtab-icon">{t.icon}</span>
          {t.label}
        </NavLink>
      ))}
    </nav>
  )
}
