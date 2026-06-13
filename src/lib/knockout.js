import { allStandings, thirdsRanking } from './standings.js'
import { R32, ROUND_NAMES } from '../data/bracket.js'

// standings → bracket doldur. Grup tamamlanmadıkça ilgili slot placeholder kalır.
export function buildBracket(schedule) {
  const standings = allStandings(schedule)
  const byLetter = {}
  standings.forEach((s) => { byLetter[s.letter] = s })
  const allComplete = standings.every((s) => s.complete)
  const thirds = allComplete ? thirdsRanking(standings) : []

  const resolve = (slot) => {
    if (slot[0] === 'T') {
      const t = thirds[parseInt(slot.slice(1), 10) - 1]
      return t ? { team: t.row.team, label: slot } : { team: null, label: '3.' }
    }
    const pos = slot[0] === '1' ? 0 : 1
    const g = byLetter[slot.slice(1)]
    if (g && g.complete) return { team: g.rows[pos].team, label: slot }
    return { team: null, label: slot }
  }

  const r32 = R32.map((m, i) => ({ id: 'R32-' + (i + 1), a: resolve(m.a), b: resolve(m.b) }))
  const rounds = [r32]
  let prev = r32
  while (prev.length > 1) {
    const next = []
    for (let i = 0; i < prev.length; i += 2) {
      next.push({
        id: 'R' + rounds.length + '-' + (i / 2 + 1),
        a: { team: null, label: '—' },
        b: { team: null, label: '—' },
      })
    }
    rounds.push(next)
    prev = next
  }
  return { rounds, names: ROUND_NAMES }
}
