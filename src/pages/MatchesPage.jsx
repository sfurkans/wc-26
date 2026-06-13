import { useLive } from '../context/LiveDataContext.jsx'
import LiveStatus from '../components/layout/LiveStatus.jsx'
import MatchRow from '../components/matches/MatchRow.jsx'

export default function MatchesPage() {
  const { schedule } = useLive()
  return (
    <section className="page">
      <h2 className="section-title">Maç Programı — Grup Aşaması (TSİ)</h2>
      <LiveStatus />
      {schedule.map((day) => (
        <div className="day-block" key={day.date}>
          <div className="day-label">{day.date}</div>
          {day.matches.map((m, i) => (
            <MatchRow key={i} m={m} />
          ))}
        </div>
      ))}
    </section>
  )
}
