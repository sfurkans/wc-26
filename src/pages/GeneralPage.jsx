import { GROUPS } from '../data/groups.js'
import Flag from '../components/layout/Flag.jsx'
import PitchView from '../components/team/PitchView.jsx'
import { fmtTeamVal } from '../lib/format.js'

const allPlayers = GROUPS.flatMap((g) => g.teams.flatMap((t) => t.players))
const teamsRanked = GROUPS.flatMap((g) => g.teams).sort((a, b) => b.val - a.val)
const maxVal = teamsRanked[0].val

export default function GeneralPage() {
  return (
    <section className="page">
      <h2 className="section-title">Genel Veriler</h2>

      <div className="gen-section">
        <h3 className="gen-head">⭐ Turnuvanın En İyi 11'i <span className="gen-sub">(piyasa değerine göre)</span></h3>
        <div className="bestxi-wrap">
          <PitchView players={allPlayers} showBench={false} />
        </div>
      </div>

      <div className="gen-section">
        <h3 className="gen-head">💰 Takım Değer Sıralaması <span className="gen-sub">({teamsRanked.length} takım)</span></h3>
        <div className="valbars">
          {teamsRanked.map((t, i) => (
            <div key={t.name} className="valbar-row">
              <div className="valbar-rank">{i + 1}</div>
              <div className="valbar-name"><Flag emoji={t.flag} w={20} />{t.name}</div>
              <div className="valbar-track">
                <div className="valbar-fill" style={{ width: `${(t.val / maxVal) * 100}%` }} />
              </div>
              <div className="valbar-val">{fmtTeamVal(t.val)}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
