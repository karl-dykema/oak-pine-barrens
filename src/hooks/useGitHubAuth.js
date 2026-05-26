import { useState, useEffect } from 'react'

// Fill these in after setting up the GitHub OAuth App + Cloudflare Worker
export const GITHUB_CLIENT_ID = 'PASTE_CLIENT_ID_HERE'
export const WORKER_URL       = 'https://PASTE_WORKER_URL_HERE'

export function useGitHubAuth() {
  const [token, setToken] = useState(() => sessionStorage.getItem('gh_token'))
  const [user,  setUser]  = useState(null)

  // Grab token from URL hash after OAuth redirect
  useEffect(() => {
    const hash = new URLSearchParams(location.hash.slice(1))
    const t = hash.get('token')
    if (t) {
      sessionStorage.setItem('gh_token', t)
      setToken(t)
      history.replaceState(null, '', location.pathname + location.search)
    }
  }, [])

  // Validate token and load GitHub user
  useEffect(() => {
    if (!token) { setUser(null); return }
    fetch('https://api.github.com/user', {
      headers: { Authorization: `token ${token}` },
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((u) => {
        if (!u) { sessionStorage.removeItem('gh_token'); setToken(null) }
        else setUser(u)
      })
      .catch(() => {})
  }, [token])

  const login = () => {
    const params = new URLSearchParams({
      client_id: GITHUB_CLIENT_ID,
      scope: 'public_repo',
      redirect_uri: WORKER_URL,
    })
    location.href = `https://github.com/login/oauth/authorize?${params}`
  }

  const logout = () => {
    sessionStorage.removeItem('gh_token')
    setToken(null)
    setUser(null)
  }

  return { token, user, login, logout }
}
