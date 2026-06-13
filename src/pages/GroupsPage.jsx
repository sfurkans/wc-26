import { useState } from 'react'
import { GROUPS } from '../data/groups.js'
import GroupCard from '../components/groups/GroupCard.jsx'
import TeamModal from '../components/team/TeamModal.jsx'

export default function GroupsPage() {
  const [sel, setSel] = useState(null) // { letter, team }

  return (
    <section className="page">
      <h2 className="section-title">Tüm Gruplar — Takıma tıklayarak kadroyu görüntüleyin</h2>
      <div className="groups-grid">
        {GROUPS.map((g) => (
          <GroupCard key={g.letter} group={g} onSelect={(letter, team) => setSel({ letter, team })} />
        ))}
      </div>
      {sel && <TeamModal team={sel.team} groupLetter={sel.letter} onClose={() => setSel(null)} />}
    </section>
  )
}
