import { SCHEDULE } from '../data/schedule.js'

const key = (home, away) => `${home}|${away}`

// Canlı veriyi (api/live veya live-data.json) schedule ile birleştirir.
// Öncelik: canlı veri > schedule'daki elle override (API bir maçı kaçırırsa güvenlik ağı).
export function mergeSchedule(live) {
  const map = {}
  live?.matches?.forEach((m) => { map[key(m.home, m.away)] = m })

  return SCHEDULE.map((day) => ({
    ...day,
    matches: day.matches.map((m) => {
      const l = map[key(m.home, m.away)]
      if (!l) return m // canlı veri yok → elle girilen veri (varsa) aynen kalır
      return {
        ...m,
        score: l.score ?? m.score,
        goals: l.goals ?? m.goals,
        status: l.status ?? (m.score ? 'FT' : undefined),
        elapsed: l.elapsed,
      }
    }),
  }))
}

// Canlı veri kaynağı: önce serverless endpoint (prod), sonra statik cache (dev/fallback).
export async function fetchLive() {
  for (const url of ['/api/live', '/live-data.json']) {
    try {
      const res = await fetch(url, { cache: 'no-store' })
      if (!res.ok) continue
      const ct = res.headers.get('content-type') || ''
      if (!ct.includes('json')) continue // vite dev SPA fallback (index.html) → atla
      return await res.json()
    } catch {
      // sıradaki kaynağı dene
    }
  }
  return null
}
