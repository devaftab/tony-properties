'use client'
import { useState, useEffect } from 'react'

import { allProperties } from '../../data/properties'

export default function AdminAnalytics() {
  const [analytics, setAnalytics] = useState({
    topLocations: [] as string[],
    propertyTypes: { rent: 0, sale: 0 }
  })

  useEffect(() => {
    // Calculate analytics data
    const calculateAnalytics = () => {
      const rent = allProperties.filter(p => p.period === '/Month').length
      const sale = allProperties.filter(p => p.period === '').length
      
      // Get top locations
      const locations = allProperties.map(p => p.location.split(',')[0])
      const locationCounts = locations.reduce((acc, loc) => {
        acc[loc] = (acc[loc] || 0) + 1
        return acc
      }, {} as Record<string, number>)
      const topLocations = Object.entries(locationCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([loc]) => loc)

      setAnalytics({
        topLocations,
        propertyTypes: { rent, sale }
      })
    }

    calculateAnalytics()
  }, [])



  return (
    <div className="admin-analytics-page">
      <div className="page-header">
        <h2>Analytics Dashboard</h2>
        <p>Track your property performance and insights</p>
      </div>



      {/* Charts Section */}
      <div className="charts-section">
        <div className="chart-grid">
          {/* Property Types Chart */}
          <div className="chart-card">
            <h3>Property Distribution</h3>
            <div className="chart-content">
              <div className="pie-chart">
                <div className="chart-legend">
                  <div className="legend-item">
                    <span className="legend-color rent"></span>
                    <span>For Rent ({analytics.propertyTypes.rent})</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-color sale"></span>
                    <span>For Sale ({analytics.propertyTypes.sale})</span>
                  </div>
                </div>
                <div className="chart-stats">
                  <div className="stat-item">
                    <strong>{analytics.propertyTypes.rent}</strong>
                    <span>Rent</span>
                  </div>
                  <div className="stat-item">
                    <strong>{analytics.propertyTypes.sale}</strong>
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
                {analytics.topLocations.map((location, index) => (
                  <div key={location} className="location-item">
                    <span className="location-rank">#{index + 1}</span>
                    <span className="location-name">{location}</span>
                    <span className="location-count">
                      {allProperties.filter(p => p.location.includes(location)).length} properties
                    </span>
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
