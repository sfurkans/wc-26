import { useState } from 'react'
import Flag from '../layout/Flag.jsx'

const TABS = [
  { key: 'scorers', label: '⚽ Gol Krallığı', field: 'goals' },
  { key: 'assists', label: '🅰️ Asist Krallığı', field: 'assists' },
  { key: 'contributions', label: '✨ Skor Katkısı', field: 'points' },
]

export default function Leaderboard({ stats }) {
  const [tab, setTab] = useState('scorers')
  const active = TABS.find((t) => t.key === tab)
  const rows = stats[tab]

  return (
    <div>
      <div className="lb-tabs">
        {TABS.map((t) => (
          <button
            key={t.key}
            className={`lb-tab${t.key === tab ? ' active' : ''}`}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {rows.length === 0 ? (
        <p className="stub">Henüz veri yok — maçlar oynandıkça dolacak.</p>
      ) : (
        <div className="lb-list">
          {rows.map((p, i) => (
            <div key={p.name + p.flag} className="lb-row">
              <div className="lb-rank">{i + 1}</div>
              <div className="lb-player"><Flag emoji={p.flag} w={20} />{p.name}</div>
              {tab === 'contributions' && (
                <div className="lb-breakdown">{p.goals}G + {p.assists}A</div>
              )}
              <div className="lb-val">{p[active.field]}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
