import { buildXI, pitchSVG } from '../../lib/formation.js'
import { compactVal } from '../../lib/format.js'

const sn = (n) => n.split(' ').pop()

function pitchHTML(players, showBench) {
  const { slots, bench } = buildXI(players)
  const shown = new Set()
  let chips = ''
  slots.forEach(({ slot, player }) => {
    if (!player) return
    const first = !shown.has(slot.pos)
    shown.add(slot.pos)
    const bArr = showBench && first ? bench[slot.pos] || [] : []
    const bLines = bArr
      .map((p) => `<div>${sn(p[0])} <span style="color:rgba(255,215,0,.38)">${compactVal(p[2])}</span></div>`)
      .join('')
    chips += `<div class="p-slot" style="left:${slot.lx}%;top:${slot.ly}%"><div class="p-chip"><span class="p-cname">${sn(player[0])}</span><span class="p-cval">${compactVal(player[2])}</span></div>${bLines ? `<div class="p-bench">${bLines}</div>` : ''}</div>`
  })
  return `<div class="pitch-wrap">${pitchSVG()}${chips}</div>`
}

export default function PitchView({ players, showBench = true }) {
  return <div dangerouslySetInnerHTML={{ __html: pitchHTML(players, showBench) }} />
}
