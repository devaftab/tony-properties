'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '../context/AuthContext'

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Don't redirect if we're already on the login page
    if (pathname === '/admin/login') {
      return
    }

    // If not loading and no user, redirect to login
    if (!loading && !user) {
      router.push('/admin/login')
    }
  }, [user, loading, router, pathname])

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    )
  }

  // If on login page, render children
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  // If no user and not on login page, don't render anything (will redirect)
  if (!user) {
    return null
  }

  // User is authenticated, render children
  return <>{children}</>
}
