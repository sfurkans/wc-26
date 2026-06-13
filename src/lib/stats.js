import { splitFlagName } from './teams.js'

// Tüm maç gollerinden gol / asist / skor katkısı liderliklerini üretir.
// Kaynak: birleştirilmiş schedule (Maçlar'daki gollerle birebir aynı).
export function buildStats(schedule) {
  const players = {} // "ad|bayrak" → { name, flag, goals, assists }

  const get = (name, flag) => {
    const k = `${name}|${flag}`
    return (players[k] ||= { name, flag, goals: 0, assists: 0 })
  }

  schedule.forEach((day) => day.matches.forEach((m) => {
    if (!m.goals?.length) return
    const side = { home: m.home, away: m.away }
    m.goals.forEach((g) => {
      const [flag] = splitFlagName(side[g.team] || '')
      // Kendi kalesine goller gol krallığına sayılmaz
      if (g.type !== 'own' && g.player) get(g.player, flag).goals++
      if (g.assist) get(g.assist, flag).assists++
    })
  }))

  const arr = Object.values(players).map((p) => ({ ...p, points: p.goals + p.assists }))
  return {
    scorers: rank(arr.filter((p) => p.goals > 0), 'goals'),
    assists: rank(arr.filter((p) => p.assists > 0), 'assists'),
    contributions: rank(arr.filter((p) => p.points > 0), 'points'),
  }
}

function rank(arr, field) {
  return [...arr].sort(
    (a, b) => b[field] - a[field] || b.points - a.points || a.name.localeCompare(b.name)
  )
}
