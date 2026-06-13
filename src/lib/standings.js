import { GROUPS } from '../data/groups.js'

function flagOf(s) { const i = s.indexOf(' '); return i > -1 ? s.slice(0, i) : s }

function parseScore(sc) {
  const m = sc.split(/[–\-—]/).map((x) => parseInt(x.trim(), 10))
  return m.length === 2 && !isNaN(m[0]) && !isNaN(m[1]) ? m : null
}

// Sıralama: Puan → Averaj → Atılan gol → isim
function cmp(a, b) {
  return b.Pts - a.Pts || b.GD - a.GD || b.GF - a.GF || a.team.name.localeCompare(b.team.name)
}

export function groupStandings(group, schedule) {
  const rows = {}
  group.teams.forEach((t) => {
    rows[t.flag] = { team: t, P: 0, W: 0, D: 0, L: 0, GF: 0, GA: 0, GD: 0, Pts: 0 }
  })
  let played = 0
  schedule.forEach((day) => day.matches.forEach((m) => {
    if (m.g !== group.letter || !m.score) return
    const sc = parseScore(m.score)
    if (!sc) return
    const H = rows[flagOf(m.home)], A = rows[flagOf(m.away)]
    if (!H || !A) return
    const [hg, ag] = sc
    played++
    H.P++; A.P++; H.GF += hg; H.GA += ag; A.GF += ag; A.GA += hg
    if (hg > ag) { H.W++; A.L++; H.Pts += 3 }
    else if (hg < ag) { A.W++; H.L++; A.Pts += 3 }
    else { H.D++; A.D++; H.Pts++; A.Pts++ }
  }))
  const arr = Object.values(rows)
  arr.forEach((r) => { r.GD = r.GF - r.GA })
  arr.sort(cmp)
  const totalMatches = (group.teams.length * (group.teams.length - 1)) / 2
  return { letter: group.letter, rows: arr, complete: played >= totalMatches }
}

export function allStandings(schedule) {
  return GROUPS.map((g) => groupStandings(g, schedule))
}

// 12 grubun 3.'leri arası sıralama — en iyi 8'i üst tura
export function thirdsRanking(standings) {
  const thirds = standings.map((s) => ({ letter: s.letter, row: s.rows[2] })).filter((x) => x.row)
  thirds.sort((a, b) => cmp(a.row, b.row))
  return thirds.map((t, i) => ({ ...t, rank: i + 1, qualified: i < 8 }))
}
