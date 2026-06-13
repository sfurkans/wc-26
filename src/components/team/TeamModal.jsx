import { useEffect, useState } from 'react'
import Flag from '../layout/Flag.jsx'
import SquadList from './SquadList.jsx'
import PitchView from './PitchView.jsx'
import { fmtTeamVal } from '../../lib/format.js'

export default function TeamModal({ team, groupLetter, onClose }) {
  const [view, setView] = useState('list')
  const hasPitch = team.name === 'Türkiye' // şimdilik sadece Türkiye (mevcut davranış)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  return (
    <div className="overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className="modal">
        <div className="modal-header">
          <div className="modal-flag"><Flag emoji={team.flag} w={42} /></div>
          <div className="modal-title-block">
            <h3>{team.name}</h3>
            <div className="modal-sub">Grup {groupLetter} · {team.players.length} Oyuncu</div>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {hasPitch && (
          <div className="view-bar">
            <button className={`view-btn${view === 'list' ? ' active' : ''}`} onClick={() => setView('list')}>☰ Liste</button>
            <button className={`view-btn${view === 'pitch' ? ' active' : ''}`} onClick={() => setView('pitch')}>⬜ Saha</button>
          </div>
        )}

        <div className="modal-body">
          {hasPitch && view === 'pitch' ? <PitchView players={team.players} /> : <SquadList team={team} />}
        </div>

        <div className="modal-footer">
          <span className="total-label">Toplam Kadro Değeri</span>
          <span className="total-value">{fmtTeamVal(team.val)}</span>
        </div>
      </div>
    </div>
  )
}
