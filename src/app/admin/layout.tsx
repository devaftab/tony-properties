'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { IoHomeOutline, IoAddOutline, IoListOutline, IoStatsChartOutline, IoSettingsOutline, IoLogOutOutline, IoMenuOutline, IoCloseOutline } from 'react-icons/io5'
import { useAuth } from './context/AuthContext'
import AdminRootLayout from './AdminRootLayout'
import './admin.css'

function AdminLayoutContent({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { isAuthenticated, isLoading, logout } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  // Check if we're on the login page
  const isLoginPage = pathname === '/admin/login'
  
  // Handle authentication redirect
  useEffect(() => {
    if (!isLoading && !isAuthenticated && !isLoginPage) {
      router.push('/admin/login')
    }
  }, [isLoading, isAuthenticated, isLoginPage, router])
  
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

  // Don't render admin layout if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null
  }

  const handleLogout = () => {
    // Show confirmation dialog
    if (confirm('Are you sure you want to logout?')) {
      logout()
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
      {/* Mobile Bottom Bar */}
      <div className="mobile-bottom-bar">
        <button 
          className="mobile-sidebar-toggle"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <IoCloseOutline /> : <IoMenuOutline />}
          <span>Menu</span>
        </button>
      </div>

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

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AdminRootLayout>
      <AdminLayoutContent>
        {children}
      </AdminLayoutContent>
    </AdminRootLayout>
  )
}
