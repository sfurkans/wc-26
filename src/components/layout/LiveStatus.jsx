import { useLive } from '../../context/LiveDataContext.jsx'

export default function LiveStatus() {
  const { status, updated, refresh } = useLive()
  const t = updated
    ? new Date(updated).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
    : null
  const busy = status === 'loading' || status === 'refreshing'

  return (
    <div className="live-status">
      {status === 'error' ? (
        <span className="ls ls-err">⚠ Canlı veri alınamadı — statik veri gösteriliyor</span>
      ) : status === 'loading' ? (
        <span className="ls ls-load">Yükleniyor…</span>
      ) : (
        <span className="ls ls-ok"><span className="ls-dot" /> Güncel{t ? ` · ${t}` : ''}</span>
      )}
      <button className="ls-btn" onClick={refresh} disabled={busy}>
        {busy ? '…' : '↻ Yenile'}
      </button>
    </div>
  )
}
