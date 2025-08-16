'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { IoAddOutline, IoListOutline, IoStatsChartOutline, IoLocationOutline, IoHomeOutline } from 'react-icons/io5'
import { supabase } from '@/lib/supabase'

interface RecentProperty {
  id: string
  title: string
  image: string
  badge: string
  badgeClass: string
  location: string
  price: string
  period: string
  bedrooms: number
  bathrooms: number
  area: number
  areaUnit: string
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProperties: 0,
    forRent: 0,
    forSale: 0
  })
  const [loading, setLoading] = useState(true)
  const [recentProperties, setRecentProperties] = useState<RecentProperty[]>([])
  const [recentLoading, setRecentLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        
        // Fetch total properties count
        const { count: totalCount, error: totalError } = await supabase
          .from('properties')
          .select('*', { count: 'exact', head: true })

        if (totalError) {
          console.error('Error fetching total properties:', totalError)
          return
        }

        // Fetch properties for rent (with period = '/Month')
        const { count: rentCount, error: rentError } = await supabase
          .from('properties')
          .select('*', { count: 'exact', head: true })
          .eq('period', '/Month')

        if (rentError) {
          console.error('Error fetching rent properties:', rentError)
          return
        }

        // Fetch properties for sale (with period = '')
        const { count: saleCount, error: saleError } = await supabase
          .from('properties')
          .select('*', { count: 'exact', head: true })
          .eq('period', '')

        if (saleError) {
          console.error('Error fetching sale properties:', saleError)
          return
        }

        setStats({
          totalProperties: totalCount || 0,
          forRent: rentCount || 0,
          forSale: saleCount || 0
        })
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }

    const fetchRecentProperties = async () => {
      try {
        setRecentLoading(true)
        
        // Fetch recent properties with their primary images
        const { data: properties, error } = await supabase
          .from('properties')
          .select(`
            *,
            property_images!inner(url, is_primary)
          `)
          .eq('property_images.is_primary', true)
          .order('created_at', { ascending: false })
          .limit(6)

        if (error) {
          console.error('Error fetching recent properties:', error)
          return
        }

        // Transform the data to match the expected format
        const transformedProperties = properties.map(property => ({
          id: property.id,
          title: property.title,
          image: property.property_images[0]?.url || '/images/property-1.jpg', // fallback image
          badge: property.badge || 'For Sale',
          badgeClass: property.period === '/Month' ? 'green' : 'orange',
          location: property.location,
          price: property.price,
          period: property.period,
          bedrooms: property.bedrooms,
          bathrooms: property.bathrooms,
          area: property.area,
          areaUnit: property.area_unit || 'sq ft'
        }))

        setRecentProperties(transformedProperties)
      } catch (error) {
        console.error('Error fetching recent properties:', error)
      } finally {
        setRecentLoading(false)
      }
    }

    fetchStats()
    fetchRecentProperties()
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
        <p>{`Here&apos;s what&apos;s happening with your properties today.`}</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <IoHomeOutline />
          </div>
          <div className="stat-content">
            <h3>{loading ? '...' : stats.totalProperties}</h3>
            <p>Total Properties</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon rent">
            <IoLocationOutline />
          </div>
          <div className="stat-content">
            <h3>{loading ? '...' : stats.forRent}</h3>
            <p>For Rent</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon sale">
            <IoLocationOutline />
          </div>
          <div className="stat-content">
            <h3>{loading ? '...' : stats.forSale}</h3>
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
          {recentLoading ? (
            <p>Loading recent properties...</p>
          ) : recentProperties.length === 0 ? (
            <p>No recent properties found.</p>
          ) : (
            recentProperties.map((property) => (
              <div key={property.id} className="recent-property-card">
                <div className="property-image">
                  <Image 
                    src={property.image} 
                    alt={property.title} 
                    width={200}
                    height={150}
                  />
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
            ))
          )}
        </div>
      </div>
    </div>
  )
}
