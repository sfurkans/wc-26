import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { fetchLive, mergeSchedule } from '../lib/live.js'
import { loadLocal, saveLocal, clearLocal } from '../lib/store.js'

const LiveContext = createContext(null)
const now = () => new Date().toISOString()

export function LiveDataProvider({ children }) {
  const [raw, setRaw] = useState(null)
  const [source, setSource] = useState(null) // 'local' (elle girilen) | 'remote' (dosya/API)
  const [status, setStatus] = useState('loading') // loading | refreshing | ready | error

  // Yükle: önce yerel (elle girilen) veri → varsa ağ'a hiç gitme. Yoksa dosya/API.
  const load = useCallback(async () => {
    const local = loadLocal()
    if (local) { setRaw(local); setSource('local'); setStatus('ready'); return }
    setStatus((prev) => (prev === 'ready' ? 'refreshing' : 'loading'))
    const data = await fetchLive()
    if (data) { setRaw(data); setSource('remote'); setStatus('ready') }
    else setStatus((prev) => (prev === 'ready' || prev === 'refreshing' ? 'ready' : 'error'))
  }, [])

  useEffect(() => {
    load()
    const id = setInterval(load, 5 * 60 * 1000) // yalnız ağ modunda etkili (yerelde load erken döner)
    return () => clearInterval(id)
  }, [load])

  // — Maç yönetimi (elle giriş) —
  const upsertResult = useCallback((result) => {
    setRaw((prev) => {
      // Yerel moddaysak üstüne ekle; dosya/demo modundan geçişte temiz başla (placeholder taşıma)
      const base = source === 'local' ? (prev?.matches || []) : []
      const matches = base.filter((m) => !(m.home === result.home && m.away === result.away))
      matches.push(result)
      const next = { updated: now(), matches }
      saveLocal(next)
      return next
    })
    setSource('local'); setStatus('ready')
  }, [source])

  const deleteResult = useCallback((home, away) => {
    setRaw((prev) => {
      const matches = (prev?.matches || []).filter((m) => !(m.home === home && m.away === away))
      const next = { updated: now(), matches }
      saveLocal(next)
      return next
    })
    setSource('local')
  }, [])

  const clearAll = useCallback(() => {
    const next = { updated: now(), matches: [] }
    saveLocal(next); setRaw(next); setSource('local'); setStatus('ready')
  }, [])

  const resetToFile = useCallback(async () => {
    clearLocal(); setSource('remote'); setStatus('loading')
    const data = await fetchLive()
    if (data) { setRaw(data); setSource('remote'); setStatus('ready') }
    else { setRaw(null); setStatus('error') }
  }, [])

  const exportJSON = useCallback(() => JSON.stringify(raw ?? { updated: now(), matches: [] }, null, 2), [raw])

  // Veriyi GitHub'a yaz (deploy sonrası çalışır) → ~1 dk içinde herkeste güncellenir
  const publish = useCallback(async () => {
    const res = await fetch('/api/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: exportJSON(),
    })
    const ct = res.headers.get('content-type') || ''
    if (!res.ok || !ct.includes('json')) {
      throw new Error('Yayınlama yalnızca deploy sonrası çalışır (sunucu fonksiyonu gerekiyor).')
    }
    const j = await res.json()
    if (!j.ok) throw new Error(j.error || 'Yayınlama başarısız')
    return true
  }, [exportJSON])

  const schedule = useMemo(() => mergeSchedule(raw), [raw])
  const value = useMemo(
    () => ({
      schedule, status, source, updated: raw?.updated || null,
      results: raw?.matches || [],
      refresh: load, upsertResult, deleteResult, clearAll, resetToFile, exportJSON, publish,
    }),
    [schedule, status, source, raw, load, upsertResult, deleteResult, clearAll, resetToFile, exportJSON, publish]
  )

  return <LiveContext.Provider value={value}>{children}</LiveContext.Provider>
}

export function useLive() {
  const ctx = useContext(LiveContext)
  if (!ctx) throw new Error('useLive, LiveDataProvider içinde kullanılmalı')
  return ctx
}
