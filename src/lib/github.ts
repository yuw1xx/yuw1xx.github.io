export interface Repo {
  name: string
  description: string | null
  html_url: string
  language: string | null
  stargazers_count: number
  fork: boolean
  archived: boolean
  pushed_at: string
}

const USER = 'yuw1xx'
const CACHE_KEY = 'yuwixx-gh-repos-v1'
const CACHE_TTL = 15 * 60 * 1000 // 15 min — keeps repeat visits/reloads off the API entirely

interface CacheEntry { repos: Repo[]; ts: number }

function readCache(): CacheEntry | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    return raw ? (JSON.parse(raw) as CacheEntry) : null
  } catch {
    return null
  }
}

function writeCache(repos: Repo[]) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ repos, ts: Date.now() }))
  } catch { /* storage unavailable — fine, just skip caching */ }
}

let inFlight: Promise<Repo[]> | null = null

export function fetchRepos(): Promise<Repo[]> {
  if (inFlight) return inFlight

  const cached = readCache()
  if (cached && Date.now() - cached.ts < CACHE_TTL) {
    return Promise.resolve(cached.repos)
  }

  inFlight = fetch(`https://api.github.com/users/${USER}/repos?per_page=100&sort=updated`)
    .then(res => {
      if (!res.ok) throw new Error('github api error')
      return res.json() as Promise<Repo[]>
    })
    .then(repos => repos.filter(r => !r.fork && !r.archived))
    .then(repos => { writeCache(repos); return repos })
    .catch(err => {
      // rate-limited or offline — fall back to a stale cache rather than erroring out
      if (cached) return cached.repos
      throw err
    })
    .finally(() => { inFlight = null })

  return inFlight
}
