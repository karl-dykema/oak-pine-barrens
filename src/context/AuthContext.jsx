import { createContext, useContext } from 'react'
import { useGitHubAuth } from '../hooks/useGitHubAuth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const auth = useGitHubAuth()
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
