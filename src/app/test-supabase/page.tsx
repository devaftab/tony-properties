'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function TestSupabase() {
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const testConnection = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('id, title, parking')
        .limit(1)
      
      if (error) {
        setMessage(`Connection error: ${error.message}`)
      } else {
        setMessage(`Connection successful! Found ${data?.length || 0} properties. First property parking: ${data?.[0]?.parking}`)
      }
    } catch (err) {
      setMessage(`Unexpected error: ${err}`)
    } finally {
      setLoading(false)
    }
  }

  const testParkingUpdate = async () => {
    setLoading(true)
    try {
      // Get the first property
      const { data: properties, error: fetchError } = await supabase
        .from('properties')
        .select('id, parking')
        .limit(1)
      
      if (fetchError) {
        setMessage(`Fetch error: ${fetchError.message}`)
        return
      }
      
      if (!properties || properties.length === 0) {
        setMessage('No properties found to test with')
        return
      }
      
      const propertyId = properties[0].id
      const currentParking = properties[0].parking
      
      // Try to update parking to a different value
      const newParkingValue = currentParking === 1 ? 2 : 1
      
      const { error: updateError } = await supabase
        .from('properties')
        .update({ parking: newParkingValue })
        .eq('id', propertyId)
      
      if (updateError) {
        setMessage(`Parking update error: ${updateError.message} (Code: ${updateError.code})`)
      } else {
        setMessage(`Parking update successful! Changed from ${currentParking} to ${newParkingValue}`)
      }
    } catch (err) {
      setMessage(`Unexpected error: ${err}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Supabase Connection Test</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={testConnection}
          disabled={loading}
          style={{ marginRight: '10px', padding: '10px 20px' }}
        >
          Test Connection
        </button>
        
        <button 
          onClick={testParkingUpdate}
          disabled={loading}
          style={{ padding: '10px 20px' }}
        >
          Test Parking Update
        </button>
      </div>
      
      {loading && <p>Loading...</p>}
      
      {message && (
        <div style={{ 
          padding: '15px', 
          backgroundColor: message.includes('error') ? '#ffebee' : '#e8f5e8',
          border: `1px solid ${message.includes('error') ? '#f44336' : '#4caf50'}`,
          borderRadius: '4px',
          marginTop: '20px'
        }}>
          <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{message}</pre>
        </div>
      )}
    </div>
  )
}
