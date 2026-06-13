// İlk 11 + yedek + saha SVG'si (mevcut index.html'den taşındı)
export const FORMATION_SLOTS = [
  { pos: 'GK', lx: 50, ly: 84 },
  { pos: 'LB', lx: 12, ly: 69 },
  { pos: 'CB', lx: 33, ly: 69 },
  { pos: 'CB', lx: 67, ly: 69 },
  { pos: 'RB', lx: 88, ly: 69 },
  { pos: 'DM', lx: 34, ly: 53 },
  { pos: 'CM', lx: 66, ly: 53 },
  { pos: 'AM', lx: 50, ly: 37 },
  { pos: 'LW', lx: 13, ly: 22 },
  { pos: 'RW', lx: 87, ly: 22 },
  { pos: 'CF', lx: 50, ly: 10 },
]

export function buildXI(players) {
  const byPos = {}
  players.forEach((p) => { (byPos[p[1]] ||= []).push(p) })
  Object.values(byPos).forEach((arr) => arr.sort((a, b) => b[2] - a[2]))
  const posIdx = {}, usedNames = new Set()
  const slots = FORMATION_SLOTS.map((slot) => {
    const i = (posIdx[slot.pos] ??= 0)
    posIdx[slot.pos]++
    const player = (byPos[slot.pos] || [])[i] || null
    if (player) usedNames.add(player[0])
    return { slot, player }
  })
  const bench = {}
  players.forEach((p) => {
    if (!usedNames.has(p[0])) (bench[p[1]] ||= []).push(p)
  })
  return { slots, bench }
}

export function pitchSVG() {
  return `<svg viewBox="0 0 340 500" xmlns="http://www.w3.org/2000/svg">
  <rect width="340" height="500" fill="#1b5e2e"/>
  ${[0, 1, 2, 3, 4, 5, 6, 7].map((i) => `<rect x="10" y="${10 + i * 60}" width="320" height="60" fill="rgba(0,0,0,${i % 2 ? 0.07 : 0})"/>`).join('')}
  <rect x="10" y="10" width="320" height="480" fill="none" stroke="rgba(255,255,255,.5)" stroke-width="1.5"/>
  <line x1="10" y1="250" x2="330" y2="250" stroke="rgba(255,255,255,.4)" stroke-width="1.5"/>
  <circle cx="170" cy="250" r="42" fill="none" stroke="rgba(255,255,255,.4)" stroke-width="1.5"/>
  <circle cx="170" cy="250" r="2.5" fill="rgba(255,255,255,.55)"/>
  <rect x="75" y="10" width="190" height="75" fill="none" stroke="rgba(255,255,255,.45)" stroke-width="1.5"/>
  <rect x="75" y="415" width="190" height="75" fill="none" stroke="rgba(255,255,255,.45)" stroke-width="1.5"/>
  <rect x="127" y="10" width="86" height="26" fill="none" stroke="rgba(255,255,255,.35)" stroke-width="1.5"/>
  <rect x="127" y="464" width="86" height="26" fill="none" stroke="rgba(255,255,255,.35)" stroke-width="1.5"/>
  <circle cx="170" cy="61" r="2" fill="rgba(255,255,255,.5)"/>
  <circle cx="170" cy="439" r="2" fill="rgba(255,255,255,.5)"/>
  <path d="M10,22 A12,12 0 0,1 22,10" fill="none" stroke="rgba(255,255,255,.3)" stroke-width="1.5"/>
  <path d="M318,10 A12,12 0 0,1 330,22" fill="none" stroke="rgba(255,255,255,.3)" stroke-width="1.5"/>
  <path d="M10,478 A12,12 0 0,0 22,490" fill="none" stroke="rgba(255,255,255,.3)" stroke-width="1.5"/>
  <path d="M318,490 A12,12 0 0,0 330,478" fill="none" stroke="rgba(255,255,255,.3)" stroke-width="1.5"/>
</svg>`
}
