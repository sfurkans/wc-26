import Flag from '../layout/Flag.jsx'

const gd = (n) => (n > 0 ? '+' + n : '' + n)

export default function StandingsTable({ data }) {
  return (
    <div className="standings-card">
      <div className="sc-head">Grup {data.letter}</div>
      <div className="sc-scroll">
        <table className="stbl">
          <thead>
            <tr>
              <th className="rk"></th><th className="tm">Takım</th>
              <th>O</th>
              <th className="sec">G</th><th className="sec">B</th><th className="sec">M</th>
              <th className="sec">A</th><th className="sec">Y</th>
              <th>AV</th><th>P</th>
            </tr>
          </thead>
          <tbody>
            {data.rows.map((r, i) => (
              <tr key={r.team.flag} className={i < 2 ? 'q' : i === 2 ? 'q3' : ''}>
                <td className="rk">{i + 1}</td>
                <td className="tm"><Flag emoji={r.team.flag} w={18} style={{ marginRight: 6 }} />{r.team.name}</td>
                <td>{r.P}</td>
                <td className="sec">{r.W}</td><td className="sec">{r.D}</td><td className="sec">{r.L}</td>
                <td className="sec">{r.GF}</td><td className="sec">{r.GA}</td>
                <td>{gd(r.GD)}</td><td className="pts">{r.Pts}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
