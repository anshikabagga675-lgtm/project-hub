import { useCallback, useMemo, useState } from 'react'
import { loginUser, registerUser } from '../services/authService.js'
import { AuthContext, USER_KEY } from './authContext.js'

const SESSION_USER_KEY = 'project-hub-session-user'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(
        window.localStorage.getItem(USER_KEY)
        || window.sessionStorage.getItem(SESSION_USER_KEY)
        || 'null',
      )
    } catch {
      window.localStorage.removeItem(USER_KEY)
      window.sessionStorage.removeItem(SESSION_USER_KEY)
      return null
    }
  })

  const login = useCallback(async (credentials) => {
    const { remember = true, ...loginDetails } = credentials
    const authenticatedUser = await loginUser(loginDetails)
    window.localStorage.removeItem(USER_KEY)
    window.sessionStorage.removeItem(SESSION_USER_KEY)
    const storage = remember ? window.localStorage : window.sessionStorage
    storage.setItem(remember ? USER_KEY : SESSION_USER_KEY, JSON.stringify(authenticatedUser))
    setUser(authenticatedUser)
  }, [])
  const register = useCallback(async (details) => {
    const newUser = await registerUser(details)
    window.localStorage.setItem(USER_KEY, JSON.stringify(newUser))
    window.sessionStorage.removeItem(SESSION_USER_KEY)
    setUser(newUser)
  }, [])
  const logout = useCallback(() => {
    window.localStorage.removeItem(USER_KEY)
    window.sessionStorage.removeItem(SESSION_USER_KEY)
    setUser(null)
  }, [])
  const updateProfile = useCallback((updates) => {
    setUser((currentUser) => {
      if (!currentUser) return currentUser
      const updatedUser = { ...currentUser, ...updates }
      const localUser = window.localStorage.getItem(USER_KEY)
      const storage = localUser ? window.localStorage : window.sessionStorage
      const key = localUser ? USER_KEY : SESSION_USER_KEY
      storage.setItem(key, JSON.stringify(updatedUser))
      return updatedUser
    })
  }, [])

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading: false,
      login,
      register,
      logout,
      updateProfile,
    }),
    [user, login, register, logout, updateProfile],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
