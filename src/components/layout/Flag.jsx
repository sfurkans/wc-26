// Bayrak emoji → flagcdn görseli (mevcut index.html'den taşındı)
const SPECIAL = { '🏴󠁧󠁢󠁥󠁮󠁧󠁿': 'gb-eng', '🏴󠁧󠁢󠁳󠁣󠁴󠁿': 'gb-sct', '🏴󠁧󠁢󠁷󠁬󠁳󠁿': 'gb-wls' }

function toIso(emoji) {
  if (SPECIAL[emoji]) return SPECIAL[emoji]
  return [...emoji]
    .map((c) => c.codePointAt(0))
    .filter((p) => p >= 0x1f1e6 && p <= 0x1f1ff)
    .map((p) => String.fromCodePoint(p - 0x1f1a5))
    .join('')
    .toLowerCase()
}

export default function Flag({ emoji, w = 26, style }) {
  return (
    <img
      src={`https://flagcdn.com/w40/${toIso(emoji)}.png`}
      width={w}
      loading="lazy"
      alt=""
      style={{ borderRadius: 2, verticalAlign: 'middle', ...style }}
    />
  )
}
