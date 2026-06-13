import Flag from '../layout/Flag.jsx'
import { TEAM_VAL, splitFlagName } from '../../lib/teams.js'
import { compactVal } from '../../lib/format.js'

function Side({ str, side }) {
  const [flag, name] = splitFlagName(str)
  return (
    <div className={side === 'home' ? 'm-home' : 'm-away'}>
      <span className="m-tname">
        <span className="m-flag"><Flag emoji={flag} w={20} /></span> {name}
      </span>
      <span className="m-tval-s">{compactVal(TEAM_VAL[str])}</span>
    </div>
  )
}

export default function MatchRow({ m }) {
  const live = m.status === 'LIVE'
  const done = !!m.score && !live
  return (
    <div className="match-wrap">
      <div className={`match-row${done ? ' match-done' : ''}${live ? ' match-live' : ''}`}>
        <div className="m-grp">{m.g}</div>
        <Side str={m.home} side="home" />
        <div className="m-mid">
          {m.score ? <span className="m-score">{m.score}</span> : <span className="m-vs">vs</span>}
          {live && (
            <span className="m-live"><span className="m-live-dot" />{m.elapsed ? `${m.elapsed}'` : 'CANLI'}</span>
          )}
        </div>
        <Side str={m.away} side="away" />
        <div className="m-time">{m.time}</div>
      </div>
      {m.goals?.length ? (
        <div className="goal-list">
          {m.goals.map((g, i) => (
            <span key={i} className="goal-item">
              <span className="gmin">{g.minute}'</span> {g.player}
              {g.type === 'penalty' ? ' (P)' : g.type === 'own' ? ' (KK)' : ''}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  )
}
