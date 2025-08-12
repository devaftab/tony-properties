'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

interface AuthContextType {
  isAuthenticated: boolean
  isLoading: boolean
  login: (token: string, user: string) => void
  logout: () => void
  checkAuth: () => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const checkAuth = () => {
    const adminToken = localStorage.getItem('adminToken')
    const adminUser = localStorage.getItem('adminUser')
    return !!(adminToken && adminUser)
  }

  const login = (token: string, user: string) => {
    localStorage.setItem('adminToken', token)
    localStorage.setItem('adminUser', user)
    setIsAuthenticated(true)
  }

  const logout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminUser')
    sessionStorage.clear()
    setIsAuthenticated(false)
    // Use window.location for logout to ensure full page reload
    window.location.href = '/admin/login'
  }

  useEffect(() => {
    // Check authentication status on mount
    const isAuth = checkAuth()
    setIsAuthenticated(isAuth)
    setIsLoading(false)
  }, [])

  // Listen for storage changes
  useEffect(() => {
    const handleStorageChange = () => {
      const isAuth = checkAuth()
      setIsAuthenticated(isAuth)
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const value = {
    isAuthenticated,
    isLoading,
    login,
    logout,
    checkAuth
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
