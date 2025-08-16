'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function TestSupabase() {
  const [status, setStatus] = useState('Testing connection...')
  const [properties, setProperties] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    testConnection()
  }, [])

  async function testConnection() {
    try {
      setStatus('Testing Supabase connection...')
      
      // Test basic connection
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      setProperties(data || [])
      setStatus(`✅ Connected! Found ${data?.length || 0} properties`)
      
    } catch (err: any) {
      setError(err.message)
      setStatus('❌ Connection failed')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          🧪 Supabase Connection Test
        </h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Connection Status</h2>
          <p className="text-gray-700">{status}</p>
          
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-800 font-medium">Error:</p>
              <p className="text-red-700">{error}</p>
            </div>
          )}
        </div>

        {properties.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">
              Properties from Database ({properties.length})
            </h2>
            <div className="space-y-3">
              {properties.map((property) => (
                <div key={property.id} className="p-3 bg-gray-50 rounded-md">
                  <h3 className="font-medium">{property.title}</h3>
                  <p className="text-sm text-gray-600">
                    {property.location} • {property.bedrooms} bed • {property.bathrooms} bath
                  </p>
                  <p className="text-sm text-gray-600">
                    ₹{property.price.toLocaleString()}{property.period}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">
            🔧 Next Steps:
          </h3>
          <ol className="list-decimal list-inside space-y-2 text-blue-700">
            <li>Verify connection is working ✅</li>
            <li>Check Supabase dashboard for data</li>
            <li>Update admin panel to use database</li>
            <li>Test CRUD operations</li>
            <li>Add real-time features</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
