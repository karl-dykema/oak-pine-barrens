import { useState, useEffect } from 'react'

export function useNetlifyIdentity() {
  const [user, setUser] = useState(() => window.netlifyIdentity?.currentUser() ?? null)

  useEffect(() => {
    const ni = window.netlifyIdentity
    if (!ni) return

    const onLogin  = (u) => setUser(u)
    const onLogout = ()  => setUser(null)

    ni.on('login',  onLogin)
    ni.on('logout', onLogout)
    return () => {
      ni.off('login',  onLogin)
      ni.off('logout', onLogout)
    }
  }, [])

  const open   = () => window.netlifyIdentity?.open()
  const logout = () => window.netlifyIdentity?.logout()

  return { user, open, logout }
}
