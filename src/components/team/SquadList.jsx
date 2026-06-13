import { posSection, SECTION_ORDER, SECTION_LABEL, SECTION_ICON } from '../../lib/positions.js'
import { fmtVal } from '../../lib/format.js'

export default function SquadList({ team }) {
  const bySec = { GK: [], DEF: [], MID: [], FWD: [] }
  team.players.forEach((p) => bySec[posSection(p[1])].push(p))
  SECTION_ORDER.forEach((s) => bySec[s].sort((a, b) => b[2] - a[2]))
  const maxVal = Math.max(...team.players.map((p) => p[2]))

  return (
    <>
      {SECTION_ORDER.filter((sec) => bySec[sec].length).map((sec) => (
        <div key={sec} className={`pos-section pos-${sec}`}>
          <div className="pos-title">{SECTION_ICON[sec]} {SECTION_LABEL[sec]}</div>
          {bySec[sec].map((p, i) => (
            <div key={p[0]} className="player-row">
              <div className="player-num">{i + 1}</div>
              <div className="player-name">{p[0]}</div>
              <div className={`player-badge badge-${p[1]}`}>{p[1]}</div>
              <div className={`player-value${p[2] === maxVal ? ' top' : ''}`}>{fmtVal(p[2])}</div>
            </div>
          ))}
        </div>
      ))}
    </>
  )
}
