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
let cache: Promise<Repo[]> | null = null

export function fetchRepos(): Promise<Repo[]> {
  if (!cache) {
    cache = fetch(`https://api.github.com/users/${USER}/repos?per_page=100&sort=updated`)
      .then(res => {
        if (!res.ok) throw new Error('github api error')
        return res.json() as Promise<Repo[]>
      })
      .then(repos => repos.filter(r => !r.fork && !r.archived))
      .catch(err => {
        cache = null
        throw err
      })
  }
  return cache
}
