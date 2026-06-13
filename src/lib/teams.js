import { GROUPS } from '../data/groups.js'

// "🇲🇽 Meksika" → değer eşlemesi (mevcut index.html'deki TEAM_VAL)
export const TEAM_VAL = {}
GROUPS.forEach((g) => g.teams.forEach((t) => { TEAM_VAL[t.flag + ' ' + t.name] = t.val }))

// "🇲🇽 Meksika" → takım nesnesi (kadro/oyuncu erişimi için — maç yönetim sayfası kullanır)
export const TEAM_BY_STR = {}
GROUPS.forEach((g) => g.teams.forEach((t) => { TEAM_BY_STR[t.flag + ' ' + t.name] = t }))

// "🇲🇽 Meksika" → ["🇲🇽", "Meksika"]
export function splitFlagName(s) {
  const i = s.indexOf(' ')
  return i > -1 ? [s.slice(0, i), s.slice(i + 1)] : [s, s]
}
