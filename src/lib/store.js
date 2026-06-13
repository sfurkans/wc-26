// Elle girilen canlı veriyi tarayıcıda saklar (live-data.json ile aynı format).
const KEY = 'wc26-live-data'

export function loadLocal() {
  try {
    const s = localStorage.getItem(KEY)
    return s ? JSON.parse(s) : null
  } catch {
    return null
  }
}

export function saveLocal(data) {
  try {
    localStorage.setItem(KEY, JSON.stringify(data))
  } catch {
    /* kota dolu / gizli mod — sessizce geç */
  }
}

export function clearLocal() {
  try {
    localStorage.removeItem(KEY)
  } catch {
    /* yoksay */
  }
}
