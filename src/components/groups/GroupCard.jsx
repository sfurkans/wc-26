import Flag from '../layout/Flag.jsx'
import { fmtTeamVal } from '../../lib/format.js'

export default function GroupCard({ group, onSelect }) {
  return (
    <div className="group-card">
      <div className="group-header">
        <div className="group-letter">{group.letter}</div>
        <div className="group-info">
          <div className="title">Grup {group.letter}</div>
          <div className="teams-count">{group.teams.length} Takım</div>
        </div>
      </div>
      <div className="teams-list">
        {group.teams.map((t) => (
          <div key={t.name} className="team-row" onClick={() => onSelect(group.letter, t)}>
            <div className="team-flag"><Flag emoji={t.flag} w={28} /></div>
            <div className="team-info">
              <div className="team-name">{t.name}</div>
              <div className="team-value">{fmtTeamVal(t.val)}</div>
            </div>
            <div className="team-arrow">›</div>
          </div>
        ))}
      </div>
    </div>
  )
}
