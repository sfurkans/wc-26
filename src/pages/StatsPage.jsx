import { useMemo } from 'react'
import { useLive } from '../context/LiveDataContext.jsx'
import LiveStatus from '../components/layout/LiveStatus.jsx'
import { buildStats } from '../lib/stats.js'
import Leaderboard from '../components/stats/Leaderboard.jsx'

export default function StatsPage() {
  const { schedule } = useLive()
  const stats = useMemo(() => buildStats(schedule), [schedule])
  return (
    <section className="page">
      <h2 className="section-title">İstatistikler</h2>
      <LiveStatus />
      <p className="legend">Tüm istatistikler oynanan maçların gollerinden hesaplanır.</p>
      <Leaderboard stats={stats} />
    </section>
  )
}
