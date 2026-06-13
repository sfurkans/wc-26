import { useState } from 'react'
import { TEAM_BY_STR } from '../../lib/teams.js'
import Flag from '../layout/Flag.jsx'

const playersOf = (teamStr) => (TEAM_BY_STR[teamStr]?.players || []).map((p) => p[0])

function parseScore(score, side) {
  if (!score) return ''
  const parts = score.split(/[–\-—]/).map((s) => s.trim())
  return parts[side] ?? ''
}

export default function MatchEditor({ match, existing, onSave, onDelete }) {
  const homePlayers = playersOf(match.home)
  const awayPlayers = playersOf(match.away)
  const homeT = TEAM_BY_STR[match.home]
  const awayT = TEAM_BY_STR[match.away]

  const [status, setStatus] = useState(existing?.status || (existing?.score ? 'FT' : 'NS'))
  const [h, setH] = useState(parseScore(existing?.score, 0))
  const [a, setA] = useState(parseScore(existing?.score, 1))
  const [elapsed, setElapsed] = useState(existing?.elapsed ?? '')
  const [goals, setGoals] = useState(
    (existing?.goals || []).map((g) => ({
      team: g.team || 'home',
      player: g.player || '',
      minute: g.minute ?? '',
      assist: g.assist || '',
      penalty: g.type === 'penalty',
      own: g.type === 'own',
    }))
  )

  const playersForGoal = (g) => (g.team === 'home' ? homePlayers : awayPlayers)

  const updateGoal = (i, patch) =>
    setGoals((gs) => gs.map((g, idx) => (idx === i ? { ...g, ...patch } : g)))

  const addGoal = () =>
    setGoals((gs) => [...gs, { team: 'home', player: homePlayers[0] || '', minute: '', assist: '', penalty: false, own: false }])

  const removeGoal = (i) => setGoals((gs) => gs.filter((_, idx) => idx !== i))

  const save = () => {
    const result = {
      home: match.home,
      away: match.away,
      status,
      score: status !== 'NS' ? `${h || 0}–${a || 0}` : undefined,
      elapsed: status === 'LIVE' && elapsed !== '' ? Number(elapsed) : undefined,
      goals: goals
        .filter((g) => g.player && g.minute !== '')
        .map((g) => ({
          minute: Number(g.minute),
          player: g.player,
          team: g.team,
          type: g.penalty ? 'penalty' : g.own ? 'own' : undefined,
          assist: g.assist || undefined,
        }))
        .sort((x, y) => x.minute - y.minute),
    }
    onSave(result)
  }

  return (
    <div className="adm-editor">
      {/* Skor + durum */}
      <div className="adm-scoreline">
        <span className="adm-team home">
          <Flag emoji={homeT?.flag} w={20} /><span className="adm-tn">{homeT?.name || match.home}</span>
        </span>
        <span className="adm-score-mid">
          <input className="adm-num" type="number" min="0" value={h} onChange={(e) => setH(e.target.value)} />
          <span className="adm-dash">–</span>
          <input className="adm-num" type="number" min="0" value={a} onChange={(e) => setA(e.target.value)} />
        </span>
        <span className="adm-team away">
          <Flag emoji={awayT?.flag} w={20} /><span className="adm-tn">{awayT?.name || match.away}</span>
        </span>
      </div>

      <div className="adm-row">
        <label className="adm-label">Durum</label>
        <select className="adm-sel" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="NS">Oynanmadı</option>
          <option value="LIVE">Canlı</option>
          <option value="FT">Bitti</option>
        </select>
        {status === 'LIVE' && (
          <>
            <label className="adm-label">Dakika</label>
            <input className="adm-num" type="number" min="0" max="120" value={elapsed} onChange={(e) => setElapsed(e.target.value)} placeholder="67" />
          </>
        )}
      </div>

      {/* Goller */}
      <div className="adm-goals">
        <div className="adm-goals-head">
          <span>Goller</span>
          <button className="adm-btn sm" onClick={addGoal}>+ Gol Ekle</button>
        </div>
        {goals.length === 0 && <p className="adm-empty">Henüz gol eklenmedi.</p>}
        {goals.map((g, i) => (
          <div className="adm-goal" key={i}>
            <input className="adm-min" type="number" min="0" value={g.minute} onChange={(e) => updateGoal(i, { minute: e.target.value })} placeholder="dk" />
            <select className="adm-sel g-team" value={g.team} onChange={(e) => updateGoal(i, { team: e.target.value, player: '', assist: '' })}>
              <option value="home">{homeT?.name || 'Ev'}</option>
              <option value="away">{awayT?.name || 'Dep'}</option>
            </select>
            <select className="adm-sel g-player" value={g.player} onChange={(e) => updateGoal(i, { player: e.target.value })}>
              <option value="">— gol atan —</option>
              {playersForGoal(g).map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
            <select className="adm-sel g-assist" value={g.assist} onChange={(e) => updateGoal(i, { assist: e.target.value })}>
              <option value="">— asist (yok) —</option>
              {playersForGoal(g).map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
            <div className="g-flags">
              <label className="adm-chk"><input type="checkbox" checked={g.penalty} onChange={(e) => updateGoal(i, { penalty: e.target.checked, own: false })} /> P</label>
              <label className="adm-chk"><input type="checkbox" checked={g.own} onChange={(e) => updateGoal(i, { own: e.target.checked, penalty: false })} /> KK</label>
            </div>
            <button className="adm-btn del sm g-del" onClick={() => removeGoal(i)}>🗑</button>
          </div>
        ))}
      </div>

      <div className="adm-actions">
        <button className="adm-btn primary" onClick={save}>💾 Kaydet</button>
        {existing?.score || existing?.status === 'LIVE' ? (
          <button className="adm-btn del" onClick={() => onDelete(match.home, match.away)}>Sonucu Sil</button>
        ) : null}
      </div>
    </div>
  )
}
