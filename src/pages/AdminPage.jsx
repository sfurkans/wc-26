import { useMemo, useState } from 'react'
import { SCHEDULE } from '../data/schedule.js'
import { useLive } from '../context/LiveDataContext.jsx'
import MatchEditor from '../components/admin/MatchEditor.jsx'
import Flag from '../components/layout/Flag.jsx'
import { TEAM_BY_STR } from '../lib/teams.js'

const keyOf = (m) => `${m.home}|${m.away}`
const nm = (s) => TEAM_BY_STR[s]?.name || s
const fl = (s) => TEAM_BY_STR[s]?.flag

export default function AdminPage() {
  const { schedule, source, results, upsertResult, deleteResult, clearAll, resetToFile, exportJSON, publish } = useLive()
  const [copied, setCopied] = useState(false)
  const [pub, setPub] = useState(null) // null | 'publishing' | 'done' | 'error'
  const [pubErr, setPubErr] = useState('')

  // Tüm fikstür (tarihiyle) — seçici için
  const fixtures = useMemo(
    () => SCHEDULE.flatMap((d) => d.matches.map((m) => ({ ...m, date: d.date }))),
    []
  )
  const [selKey, setSelKey] = useState(fixtures[0] ? keyOf(fixtures[0]) : '')
  const selected = fixtures.find((f) => keyOf(f) === selKey)

  // Seçili maçın mevcut (birleştirilmiş) sonucu
  const merged = useMemo(() => schedule.flatMap((d) => d.matches), [schedule])
  const existing = selected && merged.find((m) => m.home === selected.home && m.away === selected.away)

  // Girilen sonuçlar listesi
  const entered = results.filter((m) => m.score || m.status === 'LIVE')

  const handleSave = (result) => { upsertResult(result); flash() }
  const handleDelete = (home, away) => deleteResult(home, away)

  const flash = () => { setCopied('saved'); setTimeout(() => setCopied(false), 1500) }

  const copyJSON = async () => {
    try { await navigator.clipboard.writeText(exportJSON()); setCopied('copied'); setTimeout(() => setCopied(false), 1800) }
    catch { /* pano erişimi yok */ }
  }

  const downloadJSON = () => {
    const blob = new Blob([exportJSON()], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'live-data.json'; a.click()
    URL.revokeObjectURL(url)
  }

  const doPublish = async () => {
    setPub('publishing'); setPubErr('')
    try { await publish(); setPub('done'); setTimeout(() => setPub(null), 5000) }
    catch (e) { setPub('error'); setPubErr(e.message || String(e)) }
  }

  return (
    <section className="page adm">
      <h2 className="section-title">🔒 Maç Yönetimi (gizli)</h2>
      <p className="adm-note">
        Buraya girdiğin sonuçlar tarayıcında saklanır ve <b>Maçlar · Puan Durumu · Eleme · İstatistikler</b> sayfalarını
        anında günceller. Herkese yayınlamak için <b>🌐 Yayınla</b> butonuna bas (GitHub'a yazar, ~1 dk sonra herkeste).
      </p>

      <div className="adm-source">
        Aktif kaynak: <b>{source === 'local' ? '📝 Elle girilen (yerel)' : '📄 Dosya / API'}</b>
        {' · '}{entered.length} maç girildi
      </div>

      {/* Maç seç */}
      <div className="adm-pick">
        <label className="adm-label">Maç seç</label>
        <select className="adm-sel grow" value={selKey} onChange={(e) => setSelKey(e.target.value)}>
          {fixtures.map((f) => {
            const r = merged.find((m) => m.home === f.home && m.away === f.away)
            const mark = r?.score ? ` ✓ ${r.score}` : r?.status === 'LIVE' ? ' • CANLI' : ''
            return (
              <option key={keyOf(f)} value={keyOf(f)}>
                {f.date} · {f.g} · {nm(f.home)} – {nm(f.away)}{mark}
              </option>
            )
          })}
        </select>
      </div>

      {selected && (
        <MatchEditor
          key={selKey}
          match={selected}
          existing={existing}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      )}

      {copied === 'saved' && <div className="adm-flash">✓ Kaydedildi — sayfalar güncellendi</div>}
      {copied === 'copied' && <div className="adm-flash">✓ JSON panoya kopyalandı</div>}

      {/* Girilen sonuçlar */}
      {entered.length > 0 && (
        <div className="adm-entered">
          <h3 className="gen-head">Girilen Sonuçlar ({entered.length})</h3>
          {entered.map((m) => (
            <div className="adm-entered-row" key={keyOf(m)}>
              <button className="adm-link" onClick={() => setSelKey(keyOf(m))}>
                <Flag emoji={fl(m.home)} w={16} /> {nm(m.home)} <b>{m.score || '—'}</b> <Flag emoji={fl(m.away)} w={16} /> {nm(m.away)}
                {m.status === 'LIVE' ? ` (CANLI ${m.elapsed || ''}′)` : ''}
                {m.goals?.length ? ` · ${m.goals.length} gol` : ''}
              </button>
              <button className="adm-btn del sm" onClick={() => deleteResult(m.home, m.away)}>Sil</button>
            </div>
          ))}
        </div>
      )}

      {/* Yayınla / dışa aktar / sıfırla */}
      <div className="adm-export">
        <button className="adm-btn primary" onClick={doPublish} disabled={pub === 'publishing'}>
          {pub === 'publishing' ? '⏳ Yayınlanıyor…' : '🌐 Yayınla (herkese)'}
        </button>
        <button className="adm-btn" onClick={downloadJSON}>⬇ JSON indir</button>
        <button className="adm-btn" onClick={copyJSON}>📋 Panoya kopyala</button>
        <button className="adm-btn" onClick={clearAll}>🧹 Tümünü temizle</button>
        <button className="adm-btn" onClick={resetToFile}>↩ Dosya verisine dön</button>
      </div>
      {pub === 'done' && <div className="adm-flash">✓ Yayınlandı — ~1 dk içinde herkeste görünür</div>}
      {pub === 'error' && <div className="adm-flash err">⚠ {pubErr}</div>}
      <p className="adm-hint">
        💡 <b>Kaydet</b> = sadece sende (anında). <b>Yayınla</b> = GitHub'a yazar, ~1 dk sonra herkes görür.
      </p>
    </section>
  )
}
