'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { IoHomeOutline, IoAddOutline, IoListOutline, IoStatsChartOutline, IoSettingsOutline, IoLogOutOutline, IoMenuOutline, IoCloseOutline } from 'react-icons/io5'
import './admin.css'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if we're on the login page
    const isLoginPage = window.location.pathname === '/admin/login'
    
    if (isLoginPage) {
      // If on login page, don't check authentication
      setIsAuthenticated(false)
      setIsLoading(false)
      return
    }
    
    // Check if user is authenticated
    const adminToken = localStorage.getItem('adminToken')
    const adminUser = localStorage.getItem('adminUser')
    
    if (adminToken && adminUser) {
      setIsAuthenticated(true)
    } else {
      // Redirect to login if not authenticated
      router.push('/admin/login')
    }
    setIsLoading(false)
  }, [router])

  // Check if we're on the login page
  const isLoginPage = typeof window !== 'undefined' && window.location.pathname === '/admin/login'
  
  // If on login page, render children without admin layout
  if (isLoginPage) {
    return <>{children}</>
  }

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
        <p>Checking authentication...</p>
      </div>
    )
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return null
  }

  const handleLogout = () => {
    // Show confirmation dialog
    if (confirm('Are you sure you want to logout?')) {
      // Clear any stored authentication data
      localStorage.removeItem('adminToken')
      localStorage.removeItem('adminUser')
      sessionStorage.clear()
      
      // Show logout message
      alert('You have been logged out successfully!')
      
      // Redirect to home page
      router.push('/')
    }
  }

  const menuItems = [
    { icon: IoHomeOutline, label: 'Dashboard', href: '/admin' },
    { icon: IoAddOutline, label: 'Add Property', href: '/admin/add-property' },
    { icon: IoListOutline, label: 'All Properties', href: '/admin/properties' },
    { icon: IoStatsChartOutline, label: 'Analytics', href: '/admin/analytics' },
    { icon: IoSettingsOutline, label: 'Settings', href: '/admin/settings' },
  ]

  return (
    <div className="admin-layout">
      {/* Mobile Sidebar Toggle */}
      <button 
        className="mobile-sidebar-toggle"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <IoCloseOutline /> : <IoMenuOutline />}
      </button>

      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2 className="logo">Admin Panel</h2>
        </div>
        
        <nav className="sidebar-nav">
          <ul className="nav-list">
            {menuItems.map((item) => (
              <li key={item.href} className="nav-item">
                <Link 
                  href={item.href} 
                  className="nav-link"
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <IoLogOutOutline />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <header className="admin-header">
          <div className="header-content">
            <h1>Property Management Dashboard</h1>
            <div className="user-info">
              <span>Welcome, Admin</span>
            </div>
          </div>
        </header>
        
        <div className="admin-content">
          {children}
        </div>
      </main>
    </div>
  )
}
