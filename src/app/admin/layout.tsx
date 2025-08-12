'use client'
import { useState } from 'react'
import Link from 'next/link'
import { IoHomeOutline, IoAddOutline, IoListOutline, IoStatsChartOutline, IoSettingsOutline, IoLogOutOutline, IoMenuOutline, IoCloseOutline } from 'react-icons/io5'
import './admin.css'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

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
          <button className="logout-btn">
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
