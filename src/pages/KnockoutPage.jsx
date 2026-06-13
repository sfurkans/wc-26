import { useMemo } from 'react'
import { buildBracket } from '../lib/knockout.js'
import BracketTree from '../components/knockout/BracketTree.jsx'
import LiveStatus from '../components/layout/LiveStatus.jsx'
import { useLive } from '../context/LiveDataContext.jsx'

export default function KnockoutPage() {
  const { schedule } = useLive()
  const bracket = useMemo(() => buildBracket(schedule), [schedule])
  return (
    <section className="page">
      <h2 className="section-title">Eleme Aşaması</h2>
      <LiveStatus />
      <p className="legend">
        Gruplar tamamlandıkça takımlar otomatik yerleşir. <span className="hint">← yana kaydır →</span>
      </p>
      <BracketTree bracket={bracket} />
    </section>
  )
}
