'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { IoAddOutline, IoListOutline, IoStatsChartOutline, IoLocationOutline, IoHomeOutline } from 'react-icons/io5'
import { allProperties } from '../data/properties'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProperties: 0,
    forRent: 0,
    forSale: 0
  })

  useEffect(() => {
    const calculateStats = () => {
      const total = allProperties.length
      const rent = allProperties.filter(p => p.period === '/Month').length
      const sale = allProperties.filter(p => p.period === '').length

      setStats({
        totalProperties: total,
        forRent: rent,
        forSale: sale
      })
    }

    calculateStats()
  }, [])

  const quickActions = [
    {
      icon: IoAddOutline,
      title: 'Add New Property',
      description: 'Create a new property listing',
      href: '/admin/add-property',
      color: 'blue'
    },
    {
      icon: IoListOutline,
      title: 'Manage Properties',
      description: 'View and edit existing properties',
      href: '/admin/properties',
      color: 'green'
    },
    {
      icon: IoStatsChartOutline,
      title: 'View Analytics',
      description: 'Check property performance metrics',
      href: '/admin/analytics',
      color: 'purple'
    }
  ]

  return (
    <div className="admin-dashboard">
      {/* Welcome Section */}
      <div className="welcome-section">
        <h2>Welcome back, Sir! 👋</h2>
        <p>Here's what's happening with your properties today.</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <IoHomeOutline />
          </div>
          <div className="stat-content">
            <h3>{stats.totalProperties}</h3>
            <p>Total Properties</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon rent">
            <IoLocationOutline />
          </div>
          <div className="stat-content">
            <h3>{stats.forRent}</h3>
            <p>For Rent</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon sale">
            <IoLocationOutline />
          </div>
          <div className="stat-content">
            <h3>{stats.forSale}</h3>
            <p>For Sale</p>
          </div>
        </div>


      </div>

      {/* Quick Actions */}
      <div className="quick-actions-section">
        <h3>Quick Actions</h3>
        <div className="actions-grid">
          {quickActions.map((action) => (
            <Link key={action.href} href={action.href} className={`action-card ${action.color}`}>
              <div className="action-icon">
                <action.icon />
              </div>
              <div className="action-content">
                <h4>{action.title}</h4>
                <p>{action.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Properties */}
      <div className="recent-properties-section">
        <div className="section-header">
          <h3>Recent Properties</h3>
          <Link href="/admin/properties" className="view-all-link">
            View All Properties
          </Link>
        </div>
        
        <div className="recent-properties-grid">
          {allProperties.slice(0, 6).map((property) => (
            <div key={property.id} className="recent-property-card">
              <div className="property-image">
                <img src={property.image} alt={property.title} />
                <div className={`property-badge ${property.badgeClass}`}>
                  {property.badge}
                </div>
              </div>
              <div className="property-info">
                <h4>{property.title}</h4>
                <p className="property-location">{property.location}</p>
                <p className="property-price">
                  {property.price}{property.period}
                </p>
                <div className="property-details">
                  <span>{property.bedrooms} beds</span>
                  <span>{property.bathrooms} baths</span>
                  <span>{property.area} {property.areaUnit}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
