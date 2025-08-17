'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabase'

interface PropertyData {
  id: number
  title: string
  location: string
  price: number
  period: string
  badge: string
  description: string
  bedrooms: number
  bathrooms: number
  area: number
  area_unit: string
  property_type: string
  parking: number
  year_built: number
  slug: string
  created_at: string
}

interface AnalyticsData {
  totalProperties: number
  totalValue: number
  averagePrice: number
  propertyTypes: { [key: string]: number }
  periodDistribution: { rent: number; sale: number }
  topLocations: Array<{ location: string; count: number }>
  priceRanges: {
    'Under ₹50K': number
    '₹50K - ₹1L': number
    '₹1L - ₹2L': number
    '₹2L - ₹5L': number
    'Above ₹5L': number
  }
  bedroomDistribution: { [key: string]: number }
  areaDistribution: {
    'Under 200': number
    '200-400': number
    '400-600': number
    '600-800': number
    'Above 800': number
  }
  monthlyTrends: Array<{ month: string; count: number }>
}

export default function AdminAnalytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch all properties from Supabase
      const { data: properties, error: fetchError } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false })

      if (fetchError) {
        throw new Error(`Failed to fetch properties: ${fetchError.message}`)
      }

      if (!properties) {
        throw new Error('No properties found')
      }

      const analyticsData = calculateAnalytics(properties)
      setAnalytics(analyticsData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const calculateAnalytics = (properties: PropertyData[]): AnalyticsData => {
    const totalProperties = properties.length
    const totalValue = properties.reduce((sum, p) => sum + (p.price || 0), 0)
    const averagePrice = totalProperties > 0 ? totalValue / totalProperties : 0

    // Property types distribution
    const propertyTypes = properties.reduce((acc, p) => {
      const type = p.property_type || 'Unknown'
      acc[type] = (acc[type] || 0) + 1
      return acc
    }, {} as { [key: string]: number })

    // Period distribution (rent vs sale)
    const periodDistribution = properties.reduce((acc, p) => {
      if (p.period === '/Month') {
        acc.rent++
      } else {
        acc.sale++
      }
      return acc
    }, { rent: 0, sale: 0 })

    // Top locations
    const locationCounts = properties.reduce((acc, p) => {
      const location = p.location.split(',')[0].trim()
      acc[location] = (acc[location] || 0) + 1
      return acc
    }, {} as { [key: string]: number })

    const topLocations = Object.entries(locationCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([location, count]) => ({ location, count }))

    // Price ranges
    const priceRanges = properties.reduce((acc, p) => {
      const price = p.price || 0
      if (price < 50000) acc['Under ₹50K']++
      else if (price < 100000) acc['₹50K - ₹1L']++
      else if (price < 200000) acc['₹1L - ₹2L']++
      else if (price < 500000) acc['₹2L - ₹5L']++
      else acc['Above ₹5L']++
      return acc
    }, {
      'Under ₹50K': 0,
      '₹50K - ₹1L': 0,
      '₹1L - ₹2L': 0,
      '₹2L - ₹5L': 0,
      'Above ₹5L': 0
    })

    // Bedroom distribution
    const bedroomDistribution = properties.reduce((acc, p) => {
      const beds = p.bedrooms || 0
      const key = beds === 0 ? 'Studio' : `${beds} BHK`
      acc[key] = (acc[key] || 0) + 1
      return acc
    }, {} as { [key: string]: number })

    // Area distribution
    const areaDistribution = properties.reduce((acc, p) => {
      const area = p.area || 0
      if (area < 200) acc['Under 200']++
      else if (area < 400) acc['200-400']++
      else if (area < 600) acc['400-600']++
      else if (area < 800) acc['600-800']++
      else acc['Above 800']++
      return acc
    }, {
      'Under 200': 0,
      '200-400': 0,
      '400-600': 0,
      '600-800': 0,
      'Above 800': 0
    })

    // Monthly trends (last 6 months)
    const monthlyTrends = []
    const now = new Date()
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthName = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1)
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0)
      
      const count = properties.filter(p => {
        const createdDate = new Date(p.created_at)
        return createdDate >= monthStart && createdDate <= monthEnd
      }).length

      monthlyTrends.push({ month: monthName, count })
    }

    return {
      totalProperties,
      totalValue,
      averagePrice,
      propertyTypes,
      periodDistribution,
      topLocations,
      priceRanges,
      bedroomDistribution,
      areaDistribution,
      monthlyTrends
    }
  }

  const formatCurrency = (amount: number) => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`
    } else if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(0)}K`
    }
    return `₹${amount.toFixed(0)}`
  }

  if (loading) {
    return (
      <div className="admin-analytics-page">
        <div className="page-header">
          <h2>Analytics Dashboard</h2>
          <p>Loading analytics data...</p>
        </div>
        <div className="loading-spinner">Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="admin-analytics-page">
        <div className="page-header">
          <h2>Analytics Dashboard</h2>
          <p>Error loading analytics</p>
        </div>
        <div className="error-message">
          <p>{error}</p>
          <button onClick={fetchAnalytics} className="retry-button">
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="admin-analytics-page">
        <div className="page-header">
          <h2>Analytics Dashboard</h2>
          <p>No analytics data available</p>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-analytics-page">
      <div className="page-header">
        <h2>Analytics Dashboard</h2>
        <p>Track your property performance and insights</p>
        <button onClick={fetchAnalytics} className="refresh-button">
          Refresh Data
        </button>
      </div>

      {/* Key Metrics */}
      <div className="metrics-section">
        <div className="metric-grid">
          <div className="metric-card">
            <h3>Total Properties</h3>
            <div className="metric-value">{analytics.totalProperties}</div>
            <div className="metric-label">Properties</div>
          </div>
          <div className="metric-card">
            <h3>Total Portfolio Value</h3>
            <div className="metric-value">{formatCurrency(analytics.totalValue)}</div>
            <div className="metric-label">Portfolio Value</div>
          </div>
          <div className="metric-card">
            <h3>Average Price</h3>
            <div className="metric-value">{formatCurrency(analytics.averagePrice)}</div>
            <div className="metric-label">Per Property</div>
          </div>
          <div className="metric-card">
            <h3>Active Listings</h3>
            <div className="metric-value">{analytics.totalProperties}</div>
            <div className="metric-label">Current Listings</div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        <div className="chart-grid">
          {/* Property Types Distribution */}
          <div className="chart-card">
            <h3>Property Types</h3>
            <div className="chart-content">
              <div className="chart-legend">
                {Object.entries(analytics.propertyTypes).map(([type, count]) => (
                  <div key={type} className="legend-item">
                    <span className="legend-color" style={{ backgroundColor: getRandomColor(type) }}></span>
                    <span>{type} ({count})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Rent vs Sale Distribution */}
          <div className="chart-card">
            <h3>Rent vs Sale</h3>
            <div className="chart-content">
              <div className="pie-chart">
                <div className="chart-legend">
                  <div className="legend-item">
                    <span className="legend-color rent"></span>
                    <span>For Rent ({analytics.periodDistribution.rent})</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-color sale"></span>
                    <span>For Sale ({analytics.periodDistribution.sale})</span>
                  </div>
                </div>
                <div className="chart-stats">
                  <div className="stat-item">
                    <strong>{analytics.periodDistribution.rent}</strong>
                    <span>Rent</span>
                  </div>
                  <div className="stat-item">
                    <strong>{analytics.periodDistribution.sale}</strong>
                    <span>Sale</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Top Locations */}
          <div className="chart-card">
            <h3>Top Locations</h3>
            <div className="chart-content">
              <div className="locations-list">
                {analytics.topLocations.map((item, index) => (
                  <div key={item.location} className="location-item">
                    <span className="location-rank">#{index + 1}</span>
                    <span className="location-name">{item.location}</span>
                    <span className="location-count">{item.count} properties</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Price Ranges */}
          <div className="chart-card">
            <h3>Price Distribution</h3>
            <div className="chart-content">
              <div className="bar-chart">
                {Object.entries(analytics.priceRanges).map(([range, count]) => (
                  <div key={range} className="bar-item">
                    <div className="bar-label">{range}</div>
                    <div className="bar-container">
                      <div 
                        className="bar-fill" 
                        style={{ 
                          width: `${(count / Math.max(...Object.values(analytics.priceRanges))) * 100}%` 
                        }}
                      ></div>
                    </div>
                    <div className="bar-value">{count}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bedroom Distribution */}
          <div className="chart-card">
            <h3>Bedroom Distribution</h3>
            <div className="chart-content">
              <div className="chart-legend">
                {Object.entries(analytics.bedroomDistribution).map(([beds, count]) => (
                  <div key={beds} className="legend-item">
                    <span className="legend-color" style={{ backgroundColor: getRandomColor(beds) }}></span>
                    <span>{beds} ({count})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Monthly Trends */}
          <div className="chart-card">
            <h3>Monthly Trends</h3>
            <div className="chart-content">
              <div className="trend-chart">
                {analytics.monthlyTrends.map((trend, index) => (
                  <div key={trend.month} className="trend-item">
                    <div className="trend-month">{trend.month}</div>
                    <div className="trend-bar">
                      <div 
                        className="trend-fill" 
                        style={{ 
                          height: `${(trend.count / Math.max(...analytics.monthlyTrends.map(t => t.count))) * 100}%` 
                        }}
                      ></div>
                    </div>
                    <div className="trend-value">{trend.count}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper function to generate consistent colors for chart elements
function getRandomColor(str: string): string {
  const colors = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
    '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1'
  ]
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  return colors[Math.abs(hash) % colors.length]
}
