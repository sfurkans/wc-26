import { useMemo } from 'react'
import { allStandings, thirdsRanking } from '../lib/standings.js'
import StandingsTable from '../components/standings/StandingsTable.jsx'
import Flag from '../components/layout/Flag.jsx'
import LiveStatus from '../components/layout/LiveStatus.jsx'
import { useLive } from '../context/LiveDataContext.jsx'

const gd = (n) => (n > 0 ? '+' + n : '' + n)

export default function StandingsPage() {
  const { schedule } = useLive()
  const standings = useMemo(() => allStandings(schedule), [schedule])
  const thirds = useMemo(() => thirdsRanking(standings), [standings])

  return (
    <section className="page">
      <h2 className="section-title">Puan Durumu</h2>
      <LiveStatus />
      <p className="legend">
        <span className="dot g"></span> İlk 2: direkt üst tur &nbsp;&nbsp;
        <span className="dot y"></span> 3.: en iyi 8 üst tura
      </p>

      <div className="standings-grid">
        {standings.map((s) => (
          <StandingsTable key={s.letter} data={s} />
        ))}
      </div>

      <h3 className="gen-head" style={{ marginTop: '2.2rem' }}>
        3.'lük Sıralaması <span className="gen-sub">(en iyi 8 üst tura çıkar)</span>
      </h3>
      <div className="standings-card" style={{ maxWidth: 520 }}>
        <div className="sc-scroll">
          <table className="stbl">
            <thead>
              <tr><th className="rk"></th><th className="tm">Takım</th><th>Grup</th><th>O</th><th>AV</th><th>P</th></tr>
            </thead>
            <tbody>
              {thirds.map((t) => (
                <tr key={t.letter} className={t.qualified ? 'q' : ''}>
                  <td className="rk">{t.rank}</td>
                  <td className="tm"><Flag emoji={t.row.team.flag} w={18} style={{ marginRight: 6 }} />{t.row.team.name}</td>
                  <td>{t.letter}</td><td>{t.row.P}</td><td>{gd(t.row.GD)}</td><td className="pts">{t.row.Pts}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
