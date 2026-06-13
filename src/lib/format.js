// Piyasa değeri formatlama (mevcut index.html'den taşındı)
export function fmtVal(m) {
  if (m >= 1000) return (m / 1000).toFixed(2).replace(/\.00$/, '') + ' Milyar €'
  if (m >= 1) return parseFloat(m.toFixed(2)) + ' Milyon €'
  return Math.round(m * 1000) + ' Bin €'
}

export function fmtTeamVal(m) {
  if (m >= 1000) return (m / 1000).toFixed(2) + ' Milyar €'
  return m + ' Milyon €'
}

export function compactVal(v) {
  if (!v) return ''
  if (v >= 1000) return (v / 1000).toFixed(2) + ' Mia €'
  return parseFloat(v.toFixed(1)) + ' Mn €'
}
