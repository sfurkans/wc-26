// Vercel Serverless Function — API-Football proxy.
// Anahtar process.env.API_FOOTBALL_KEY içinde gizli; client kendi origin'ini (/api/live) çağırır → CORS yok.
// Çıktı: public/live-data.json ile AYNI format → lib/live.js doğrudan tüketir.
import { GROUPS } from '../src/data/groups.js'

const LEAGUE_ID = 1 // FIFA World Cup
const SEASON = 2026
const RAPID_HOST = 'api-football-v1.p.rapidapi.com'

// İki erişim yolunu da destekler: RapidAPI (RAPIDAPI_KEY) veya doğrudan api-sports (API_FOOTBALL_KEY).
// Yanıt formatı her ikisinde de aynı — transform() değişmez.
function apiConfig() {
  if (process.env.RAPIDAPI_KEY) {
    return {
      base: `https://${RAPID_HOST}/v3`,
      headers: { 'x-rapidapi-key': process.env.RAPIDAPI_KEY, 'x-rapidapi-host': RAPID_HOST },
    }
  }
  if (process.env.API_FOOTBALL_KEY) {
    return {
      base: 'https://v3.football.api-sports.io',
      headers: { 'x-apisports-key': process.env.API_FOOTBALL_KEY },
    }
  }
  return null
}

// Bizim Türkçe ad → "🇽🇽 Ad" tam string (groups.js'ten üretilir; emoji elle yazılmaz).
const FULL = {}
GROUPS.forEach((g) => g.teams.forEach((t) => { FULL[t.name] = `${t.flag} ${t.name}` }))

// API-Football (İngilizce) → bizim Türkçe ad.
// NOT: Adlar gerçek API yanıtıyla doğrulanmalı; alternatif yazımlar da eklendi.
const EN_TO_TR = {
  Mexico: 'Meksika', 'South Africa': 'Güney Afrika', 'South Korea': 'Güney Kore', Korea: 'Güney Kore',
  Czechia: 'Çekya', 'Czech Republic': 'Çekya',
  Canada: 'Kanada', 'Bosnia and Herzegovina': 'Bosna Hersek', Qatar: 'Katar', Switzerland: 'İsviçre',
  Brazil: 'Brezilya', Morocco: 'Fas', Haiti: 'Haiti', Scotland: 'İskoçya',
  USA: 'ABD', 'United States': 'ABD', Paraguay: 'Paraguay', Australia: 'Avustralya',
  Turkey: 'Türkiye', 'Türkiye': 'Türkiye',
  Germany: 'Almanya', Curacao: 'Curaçao', 'Curaçao': 'Curaçao',
  'Ivory Coast': 'Fildişi Sahili', "Côte d'Ivoire": 'Fildişi Sahili', Ecuador: 'Ekvador',
  Netherlands: 'Hollanda', Japan: 'Japonya', Sweden: 'İsveç', Tunisia: 'Tunus',
  Belgium: 'Belçika', Egypt: 'Mısır', Iran: 'İran', 'New Zealand': 'Yeni Zelanda',
  Spain: 'İspanya', 'Cape Verde': 'Yeşil Burun Adaları', 'Cape Verde Islands': 'Yeşil Burun Adaları',
  'Saudi Arabia': 'Suudi Arabistan', Uruguay: 'Uruguay',
  France: 'Fransa', Senegal: 'Senegal', Iraq: 'Irak', Norway: 'Norveç',
  Argentina: 'Arjantin', Algeria: 'Cezayir', Austria: 'Avusturya', Jordan: 'Ürdün',
  Portugal: 'Portekiz', 'DR Congo': 'Dem. Kongo', 'Congo DR': 'Dem. Kongo', Uzbekistan: 'Özbekistan',
  Colombia: 'Kolombiya', England: 'İngiltere', Croatia: 'Hırvatistan', Ghana: 'Gana', Panama: 'Panama',
}

const teamStr = (enName) => FULL[EN_TO_TR[enName]] // eşlenemezse undefined

export default async function handler(req, res) {
  const cfg = apiConfig()
  if (!cfg) return res.status(500).json({ error: 'API anahtarı tanımlı değil (RAPIDAPI_KEY veya API_FOOTBALL_KEY)' })

  try {
    const r = await fetch(`${cfg.base}/fixtures?league=${LEAGUE_ID}&season=${SEASON}`, {
      headers: cfg.headers,
    })
    const data = await r.json()
    const matches = (data.response || []).map(transform).filter(Boolean)
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600') // 5 dk cache
    return res.status(200).json({ updated: new Date().toISOString(), matches })
  } catch (e) {
    return res.status(502).json({ error: 'API-Football çağrısı başarısız', detail: String(e) })
  }
}

function transform(fx) {
  const home = teamStr(fx.teams?.home?.name)
  const away = teamStr(fx.teams?.away?.name)
  if (!home || !away) return null // eşlenemeyen maçları atla (güvenlik ağı: schedule devreye girer)

  const st = fx.fixture?.status?.short // NS, 1H, HT, 2H, ET, P, FT, AET, PEN ...
  const live = ['1H', 'HT', '2H', 'ET', 'BT', 'P', 'LIVE'].includes(st)
  const finished = ['FT', 'AET', 'PEN'].includes(st)
  const hg = fx.goals?.home, ag = fx.goals?.away
  const hasScore = hg != null && ag != null && (live || finished)

  return {
    home,
    away,
    status: live ? 'LIVE' : finished ? 'FT' : 'NS',
    score: hasScore ? `${hg}–${ag}` : undefined,
    elapsed: live ? fx.fixture?.status?.elapsed ?? undefined : undefined,
    goals: (fx.events || [])
      .filter((e) => e.type === 'Goal' && e.detail !== 'Missed Penalty')
      .map((e) => ({
        minute: e.time?.elapsed,
        player: e.player?.name,
        team: teamStr(e.team?.name) === home ? 'home' : 'away',
        type: e.detail === 'Penalty' ? 'penalty' : e.detail === 'Own Goal' ? 'own' : undefined,
        assist: e.assist?.name || undefined,
      })),
  }
}
