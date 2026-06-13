// Vercel Serverless — /yonet'ten gelen maç verisini GitHub repo'sundaki public/live-data.json'a yazar.
// Commit sonrası Vercel otomatik yeniden deploy eder → ~1 dk içinde herkes güncel veriyi görür.
//
// Gerekli env değişkenleri (Vercel → Settings → Environment Variables):
//   GITHUB_TOKEN   → repo yazma yetkili token (gizli, sunucuda kalır)
//   GITHUB_OWNER   → GitHub kullanıcı/teşkilat adı
//   GITHUB_REPO    → repo adı
// Opsiyonel:
//   GITHUB_BRANCH  → varsayılan "main"
//   ADMIN_SECRET   → ayarlanırsa, istek "x-admin-secret" başlığıyla bu değeri taşımalı

const GH_API = 'https://api.github.com'
const FILE_PATH = 'public/live-data.json'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Sadece POST' })

  const {
    GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO,
    GITHUB_BRANCH = 'main', ADMIN_SECRET,
  } = process.env

  if (!GITHUB_TOKEN || !GITHUB_OWNER || !GITHUB_REPO) {
    return res.status(500).json({ error: 'GitHub env değişkenleri eksik (GITHUB_TOKEN / GITHUB_OWNER / GITHUB_REPO)' })
  }
  if (ADMIN_SECRET && req.headers['x-admin-secret'] !== ADMIN_SECRET) {
    return res.status(401).json({ error: 'Yetkisiz' })
  }

  // Gövdeyi doğrula
  let data = req.body
  if (typeof data === 'string') {
    try { data = JSON.parse(data) } catch { return res.status(400).json({ error: 'Geçersiz JSON' }) }
  }
  if (!data || !Array.isArray(data.matches)) {
    return res.status(400).json({ error: 'Beklenen format: { matches: [...] }' })
  }

  const url = `${GH_API}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${FILE_PATH}`
  const headers = {
    Authorization: `Bearer ${GITHUB_TOKEN}`,
    Accept: 'application/vnd.github+json',
    'User-Agent': 'wc26-admin',
  }

  try {
    // Mevcut dosyanın SHA'sını al (güncelleme için gerekir; ilk seferde yoksa atla)
    let sha
    const cur = await fetch(`${url}?ref=${GITHUB_BRANCH}`, { headers })
    if (cur.ok) sha = (await cur.json()).sha

    const content = Buffer.from(JSON.stringify(data, null, 2)).toString('base64')
    const put = await fetch(url, {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        message: `chore: maç verisi güncellendi (${new Date().toISOString()})`,
        content,
        sha,
        branch: GITHUB_BRANCH,
      }),
    })

    if (!put.ok) {
      const detail = await put.text()
      return res.status(502).json({ error: 'GitHub yazma başarısız', detail })
    }
    return res.status(200).json({ ok: true })
  } catch (e) {
    return res.status(502).json({ error: 'Sunucu hatası', detail: String(e) })
  }
}
