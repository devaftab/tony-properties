'use client'
import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { IoAddOutline, IoSearchOutline, IoTrashOutline } from 'react-icons/io5'
import {MdOutlineEdit} from 'react-icons/md'
import { Property } from '../../data/properties'
import { supabase } from '@/lib/supabase'
import { useSearchParams } from 'next/navigation'

export default function AdminProperties() {
  const searchParams = useSearchParams()
  const refreshKey = searchParams.get('refresh')
  
  const [properties, setProperties] = useState<Property[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [sortBy, setSortBy] = useState('id')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [selectedProperties, setSelectedProperties] = useState<number[]>([])
  const [deletingProperties, setDeletingProperties] = useState<Set<number>>(new Set())
  const [isBulkDeleting, setIsBulkDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [propertyToDelete, setPropertyToDelete] = useState<{ id: number; title: string } | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)


  // Load properties from Supabase when component mounts
  useEffect(() => {
    fetchProperties()
  }, [])

  // Update properties when refresh parameter changes
  useEffect(() => {
    if (refreshKey) {
      fetchProperties()
    }
  }, [refreshKey])

  // Function to fetch properties from Supabase
  const fetchProperties = async () => {
    try {
      setIsRefreshing(true)
      console.log('🔄 Fetching properties from Supabase...')
      
      // First, get all properties
      const { data: propertiesData, error: propertiesError } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false })

      if (propertiesError) {
        console.error('Error fetching properties:', propertiesError)
        return
      }

      // Then, get all property images
      const { data: imagesData, error: imagesError } = await supabase
        .from('property_images')
        .select('*')
        .eq('is_primary', true)

      if (imagesError) {
        console.error('Error fetching images:', imagesError)
      }

      // Create a map of property_id to image
      const imageMap = new Map()
      imagesData?.forEach(img => {
        imageMap.set(img.property_id, img)
      })

      // Transform data to match Property interface
      const transformedProperties = propertiesData?.map(property => ({
        ...property,
        image: imageMap.get(property.id)?.thumbnail_url || 
               imageMap.get(property.id)?.url || 
               '/images/property-1.jpg' // Fallback image
      })) || []

      setProperties(transformedProperties)
      console.log(`✅ Loaded ${transformedProperties.length} properties from Supabase`)
    } catch (error) {
      console.error('Error fetching properties:', error)
    } finally {
      setIsRefreshing(false)
    }
  }

  // Filter and search properties
  const filteredProperties = useMemo(() => {
    let filtered = properties

    // Apply type filter
    if (selectedFilter === 'rent') {
      filtered = filtered.filter(p => p.period === '/Month')
    } else if (selectedFilter === 'sale') {
      filtered = filtered.filter(p => p.period === '')
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: string | number = a[sortBy as keyof Property] as string | number
      let bValue: string | number = b[sortBy as keyof Property] as string | number

      if (sortBy === 'price') {
        aValue = parseInt(String(aValue).replace(/[^\d]/g, ''))
        bValue = parseInt(String(bValue).replace(/[^\d]/g, ''))
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1
      return 0
    })

    return filtered
  }, [properties, searchTerm, selectedFilter, sortBy, sortOrder, refreshKey])

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
  }

  const handleSelectAll = () => {
    if (selectedProperties.length === filteredProperties.length) {
      setSelectedProperties([])
    } else {
      setSelectedProperties(filteredProperties.map(p => p.id))
    }
  }

  const handleSelectProperty = (id: number) => {
    setSelectedProperties(prev => 
      prev.includes(id) 
        ? prev.filter(p => p !== id)
        : [...prev, id]
    )
  }

  const handleDeleteSelected = async () => {
    if (confirm(`Are you sure you want to delete ${selectedProperties.length} properties? This action cannot be undone.`)) {
      try {
        setIsBulkDeleting(true)
        const deletedIds: number[] = []
        const failedDeletions: string[] = []

        console.log(`🗑️ Starting bulk deletion of ${selectedProperties.length} properties...`)

        // Delete properties one by one
        for (const id of selectedProperties) {
          try {
            console.log(`🗑️ Deleting property ID: ${id}...`)
            
            // Delete property images first
            const { error: imagesError } = await supabase
              .from('property_images')
              .delete()
              .eq('property_id', id)

            if (imagesError) {
              console.error(`Error deleting images for property ${id}:`, imagesError)
            } else {
              console.log(`✅ Deleted images for property ID: ${id}`)
            }

            // Delete property amenities
            const { error: amenitiesError } = await supabase
              .from('property_amenities')
              .delete()
              .eq('property_id', id)

            if (amenitiesError) {
              console.error(`Error deleting amenities for property ${id}:`, amenitiesError)
            } else {
              console.log(`✅ Deleted amenities for property ID: ${id}`)
            }

            // Finally delete the property
            const { error: propertyError } = await supabase
              .from('properties')
              .delete()
              .eq('id', id)

            if (propertyError) {
              throw new Error(`Failed to delete property ${id}: ${propertyError.message}`)
            }

            deletedIds.push(id)
            console.log(`✅ Successfully deleted property ID: ${id}`)
          } catch (error) {
            console.error(`Error deleting property ${id}:`, error)
            failedDeletions.push(`Property ID ${id}`)
          }
        }

        console.log(`🔄 Bulk deletion completed. Successfully deleted: ${deletedIds.length}, Failed: ${failedDeletions.length}`)

        // Update local state
        setProperties(prev => {
          const newProperties = prev.filter(p => !selectedProperties.includes(p.id))
          console.log(`🔄 Updated local state. Properties count: ${prev.length} → ${newProperties.length}`)
          return newProperties
        })
      setSelectedProperties([])

        // Show results
        if (deletedIds.length > 0) {
          alert(`Successfully deleted ${deletedIds.length} properties!`)
        }
        
        if (failedDeletions.length > 0) {
          alert(`Failed to delete: ${failedDeletions.join(', ')}`)
        }

        // Force refresh from database to ensure consistency
        setTimeout(() => {
          console.log('🔄 Forcing refresh from database after bulk delete...')
          fetchProperties()
        }, 500)

      } catch (error) {
        console.error('Error in bulk delete operation:', error)
        alert(`Bulk delete operation failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
      } finally {
        setIsBulkDeleting(false)
      }
    }
  }

  const handleDeleteProperty = async (id: number, title: string) => {
    setPropertyToDelete({ id, title })
    setShowDeleteConfirm(true)
  }

  const confirmDeleteProperty = async () => {
    if (!propertyToDelete) return
    
    try {
      setDeletingProperties(prev => new Set(prev).add(propertyToDelete.id))

      console.log(`🗑️ Starting deletion of property: ${propertyToDelete.title} (ID: ${propertyToDelete.id})`)

      // Use a transaction-like approach to ensure all deletions complete
      let deletionSuccessful = true

      // Delete property images first (due to foreign key constraints)
      const { error: imagesError } = await supabase
        .from('property_images')
        .delete()
        .eq('property_id', propertyToDelete.id)

      if (imagesError) {
        console.error('Error deleting property images:', imagesError)
        deletionSuccessful = false
      } else {
        console.log(`✅ Deleted property images for property ID: ${propertyToDelete.id}`)
      }

      // Delete property amenities
      const { error: amenitiesError } = await supabase
        .from('property_amenities')
        .delete()
        .eq('property_id', propertyToDelete.id)

      if (amenitiesError) {
        console.error('Error deleting property amenities:', amenitiesError)
        deletionSuccessful = false
      } else {
        console.log(`✅ Deleted property amenities for property ID: ${propertyToDelete.id}`)
      }

      // Finally delete the property
      console.log(`🗑️ Attempting to delete property from database...`)
      const { data: deleteResult, error: propertyError, count } = await supabase
        .from('properties')
        .delete()
        .eq('id', propertyToDelete.id)
        .select()

      if (propertyError) {
        console.error('Error deleting property:', propertyError)
        deletionSuccessful = false
        throw new Error(`Failed to delete property: ${propertyError.message}`)
      }

      console.log(`✅ Delete result:`, deleteResult)
      console.log(`✅ Successfully deleted property from database: ${propertyToDelete.title}`)
      
      // Check if the property was actually deleted by querying immediately
      const { data: immediateCheck } = await supabase
        .from('properties')
        .select('id, title')
        .eq('id', propertyToDelete.id)
        .single()
      
      if (immediateCheck) {
        console.warn(`⚠️ IMMEDIATE CHECK: Property still exists after delete operation!`)
        console.warn(`⚠️ Property data:`, immediateCheck)
      } else {
        console.log(`✅ IMMEDIATE CHECK: Property successfully removed`)
      }

      // Wait a moment for database consistency, then verify deletion
      console.log('⏳ Waiting for database consistency...')
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Try verification up to 3 times with increasing delays
      let verificationAttempts = 0
      let verificationSuccessful = false
      let verifyData = null
      
      while (verificationAttempts < 3 && !verificationSuccessful) {
        verificationAttempts++
        console.log(`🔍 Verification attempt ${verificationAttempts}/3...`)
        
        const { data: checkData, error: verifyError } = await supabase
          .from('properties')
          .select('id')
          .eq('id', propertyToDelete.id)
          .single()

        if (checkData) {
          console.warn(`⚠️ Property ${propertyToDelete.id} still exists after deletion (attempt ${verificationAttempts})`)
          if (verificationAttempts < 3) {
            console.log(`⏳ Waiting ${verificationAttempts * 1000}ms before next attempt...`)
            await new Promise(resolve => setTimeout(resolve, verificationAttempts * 1000))
          }
        } else {
          console.log(`✅ Verification successful on attempt ${verificationAttempts}: Property ${propertyToDelete.id} removed`)
          verificationSuccessful = true
          break
        }
      }
      
      if (verificationSuccessful) {
        deletionSuccessful = true
      } else {
        console.warn(`⚠️ All verification attempts failed for property ${propertyToDelete.id}`)
        deletionSuccessful = false
      }

      if (deletionSuccessful) {
        // Remove from local state
        setProperties(prev => {
          const newProperties = prev.filter(p => p.id !== propertyToDelete.id)
          console.log(`🔄 Updated local state. Properties count: ${prev.length} → ${newProperties.length}`)
          return newProperties
        })
        
        // Clear selection if this property was selected
        setSelectedProperties(prev => prev.filter(p => p !== propertyToDelete.id))
        
        // Close modal and reset
        setShowDeleteConfirm(false)
        setPropertyToDelete(null)
        
        // Show success message
        setSuccessMessage(`Property "${propertyToDelete.title}" deleted successfully!`)
        setTimeout(() => setSuccessMessage(null), 5000)
        
        // Force refresh from database to ensure consistency
        setTimeout(() => {
          console.log('🔄 Forcing refresh from database...')
          fetchProperties()
        }, 1000) // Increased delay to ensure database consistency
      } else {
        // Even if verification fails, we'll still remove from local state
        // but show a warning to the user
        console.warn('⚠️ Deletion verification failed, but proceeding with local state update')
        setSuccessMessage(`Property "${propertyToDelete.title}" deleted with warning - please refresh to confirm`)
        setTimeout(() => setSuccessMessage(null), 8000)
      }
      
    } catch (error) {
      console.error('Error deleting property:', error)
      
      // Provide more specific error messages
      let errorMessage = 'Unknown error occurred'
      if (error instanceof Error) {
        if (error.message.includes('verification failed')) {
          errorMessage = 'Property was deleted but verification failed. Please refresh the page to confirm.'
        } else if (error.message.includes('Failed to delete property')) {
          errorMessage = 'Failed to delete property from database. Please try again.'
        } else {
          errorMessage = error.message
        }
      }
      
      alert(`Failed to delete property: ${errorMessage}`)
    } finally {
      setDeletingProperties(prev => {
        const newSet = new Set(prev)
        newSet.delete(propertyToDelete.id)
        return newSet
      })
    }
  }

  const cancelDelete = () => {
    setShowDeleteConfirm(false)
    setPropertyToDelete(null)
  }

  // Debug function to check database directly
  const checkDatabaseDirectly = async () => {
    try {
      console.log('🔍 Checking database directly...')
      
      const { data: dbProperties, error: dbError } = await supabase
        .from('properties')
        .select('id, title, created_at')
        .order('created_at', { ascending: false })

      if (dbError) {
        console.error('Database check error:', dbError)
        setDebugInfo(`Database Error: ${dbError.message}`)
        return
      }

      const { data: dbImages, error: imagesError } = await supabase
        .from('property_images')
        .select('property_id, is_primary')
        .eq('is_primary', true)

      if (imagesError) {
        console.error('Images check error:', imagesError)
      }

      console.log('🔍 Database check results:')
      console.log(`- Properties in DB: ${dbProperties?.length || 0}`)
      console.log(`- Primary images in DB: ${dbImages?.length || 0}`)
      console.log('- Property IDs:', dbProperties?.map(p => p.id) || [])
      
      setDebugInfo(`DB: ${dbProperties?.length || 0} properties, ${dbImages?.length || 0} primary images`)
      
      // Compare with local state
      if (properties.length !== (dbProperties?.length || 0)) {
        console.warn(`⚠️ Mismatch: Local state has ${properties.length} properties, DB has ${dbProperties?.length || 0}`)
        setDebugInfo(`⚠️ MISMATCH: Local ${properties.length} vs DB ${dbProperties?.length || 0}`)
        
        // Find which properties are missing from local state
        const localIds = new Set(properties.map(p => p.id))
        const dbIds = new Set(dbProperties?.map(p => p.id) || [])
        const missingFromLocal = Array.from(dbIds).filter(id => !localIds.has(id))
        const missingFromDB = Array.from(localIds).filter(id => !dbIds.has(id))
        
        if (missingFromLocal.length > 0) {
          console.log('📋 Properties in DB but not in local state:', missingFromLocal)
        }
        if (missingFromDB.length > 0) {
          console.log('📋 Properties in local state but not in DB:', missingFromDB)
        }
      } else {
        console.log('✅ Local state and database are in sync')
        setDebugInfo(`✅ SYNC: Local ${properties.length} = DB ${dbProperties?.length || 0}`)
      }
      
      // Clear debug info after 8 seconds
      setTimeout(() => setDebugInfo(null), 8000)
      
    } catch (error) {
      console.error('Error checking database:', error)
      setDebugInfo(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  // Function to test deletion with a simple property
  const testDeletion = async () => {
    try {
      console.log('🧪 Testing deletion process...')
      
      // First, let's check if we can actually delete anything
      const { data: testProperty } = await supabase
        .from('properties')
        .select('id, title')
        .limit(1)
        .single()
      
      if (!testProperty) {
        console.log('❌ No properties found to test with')
        return
      }
      
      console.log(`🧪 Testing deletion with property: ${testProperty.title} (ID: ${testProperty.id})`)
      
      // Try to delete just this property (without images/amenities first)
      const { data: deleteTest, error: deleteError } = await supabase
        .from('properties')
        .delete()
        .eq('id', testProperty.id)
        .select()
      
      if (deleteError) {
        console.error('❌ Test deletion failed:', deleteError)
        setDebugInfo(`Test deletion failed: ${deleteError.message}`)
        return
      }
      
      console.log('✅ Test deletion result:', deleteTest)
      
      // Check if it was actually deleted
      const { data: checkTest } = await supabase
        .from('properties')
        .select('id')
        .eq('id', testProperty.id)
        .single()
      
      if (checkTest) {
        console.warn('⚠️ Test property still exists after deletion!')
        setDebugInfo('⚠️ Test deletion failed - property still exists')
      } else {
        console.log('✅ Test deletion successful!')
        setDebugInfo('✅ Test deletion successful')
      }
      
      // Clear debug info after 10 seconds
      setTimeout(() => setDebugInfo(null), 10000)
      
    } catch (error) {
      console.error('Error in test deletion:', error)
      setDebugInfo(`Test error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  // Function to check RLS policies and database constraints
  const checkDatabaseConstraints = async () => {
    try {
      console.log('🔒 Checking database constraints and RLS...')
      
      // Check if we can perform basic operations
      const { data: canSelect, error: selectError } = await supabase
        .from('properties')
        .select('count')
        .limit(1)
      
      if (selectError) {
        console.error('❌ SELECT operation failed:', selectError)
        setDebugInfo(`SELECT failed: ${selectError.message}`)
        return
      }
      
      console.log('✅ SELECT operation successful')
      
      // Try a simple update to see if we have write permissions
      const { data: testUpdate, error: updateError } = await supabase
        .from('properties')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', 1)
        .select()
        .limit(1)
      
      if (updateError) {
        console.error('❌ UPDATE operation failed:', updateError)
        setDebugInfo(`UPDATE failed: ${updateError.message}`)
      } else {
        console.log('✅ UPDATE operation successful')
        setDebugInfo('✅ UPDATE working - checking DELETE permissions...')
        
        // Now test if we can actually delete anything
        const { data: testDelete, error: deleteError } = await supabase
          .from('properties')
          .delete()
          .eq('id', 999999) // Use a non-existent ID to test permissions
          .select()
        
        if (deleteError) {
          console.error('❌ DELETE operation failed:', deleteError)
          setDebugInfo(`DELETE failed: ${deleteError.message}`)
        } else {
          console.log('✅ DELETE operation permission test successful')
          setDebugInfo('✅ DELETE permissions OK - issue may be with specific records')
        }
      }
      
      // Clear debug info after 8 seconds
      setTimeout(() => setDebugInfo(null), 8000)
      
    } catch (error) {
      console.error('Error checking database constraints:', error)
      setDebugInfo(`Constraint check error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  // Function to check RLS policies specifically
  const checkRLSPolicies = async () => {
    try {
      console.log('🔐 Checking RLS policies...')
      
      // First, check authentication status
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      console.log('🔐 Authentication check:', { user: user?.id, error: authError })
      
      if (authError || !user) {
        console.error('❌ Not authenticated with Supabase!')
        setDebugInfo('❌ Not authenticated - this is why deletion fails!')
        return
      }
      
      console.log('✅ Authenticated as user:', user.id)
      
      // Check if RLS is enabled
      let rlsEnabled = null
      let rlsError = null
      try {
        const result = await supabase
          .rpc('check_rls_enabled', { table_name: 'properties' })
        rlsEnabled = result.data
        rlsError = result.error
      } catch {
        rlsError = 'RPC not available'
      }
      
      if (rlsError) {
        console.log('ℹ️ RPC not available, checking manually...')
        
        // Try to check RLS status by attempting operations with different contexts
        console.log('🔍 Testing RLS behavior...')
        
        // Test 1: Try to delete a property that definitely exists
        const { data: existingProperty } = await supabase
          .from('properties')
          .select('id, title')
          .limit(1)
          .single()
        
        if (existingProperty) {
          console.log(`🧪 Testing deletion of existing property: ${existingProperty.title} (ID: ${existingProperty.id})`)
          
          // Try deletion and see what happens
          const { data: deleteResult, error: deleteError } = await supabase
            .from('properties')
            .delete()
            .eq('id', existingProperty.id)
            .select()
          
          console.log('🗑️ Delete result:', deleteResult)
          console.log('🗑️ Delete error:', deleteError)
          
          if (deleteError) {
            console.error('❌ Delete failed with error:', deleteError)
            setDebugInfo(`Delete failed: ${deleteError.message}`)
          } else if (deleteResult && deleteResult.length > 0) {
            console.warn('⚠️ Delete returned data instead of deleting!')
            setDebugInfo('⚠️ Delete returned data - RLS may be blocking actual deletion')
          } else {
            console.log('✅ Delete operation completed')
            
            // Check if it was actually deleted
            const { data: checkResult } = await supabase
              .from('properties')
              .select('id')
              .eq('id', existingProperty.id)
              .single()
            
            if (checkResult) {
              console.warn('⚠️ Property still exists after deletion!')
              setDebugInfo('⚠️ Property persists after delete - RLS or constraints blocking')
            } else {
              console.log('✅ Property successfully deleted')
              setDebugInfo('✅ Property deletion working correctly')
            }
          }
        }
      } else {
        console.log('✅ RLS check result:', rlsEnabled)
        setDebugInfo(`RLS Status: ${JSON.stringify(rlsEnabled)}`)
      }
      
      // Clear debug info after 10 seconds
      setTimeout(() => setDebugInfo(null), 10000)
      
    } catch (error) {
      console.error('Error checking RLS policies:', error)
      setDebugInfo(`RLS check error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  // Function to check authentication status
  const checkAuthentication = async () => {
    try {
      console.log('🔐 Checking authentication status...')
      
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      if (authError) {
        console.error('❌ Authentication error:', authError)
        setDebugInfo(`❌ Auth Error: ${authError.message}`)
        return
      }
      
      if (!user) {
        console.error('❌ No user found - not authenticated')
        setDebugInfo('❌ Not authenticated - need to sign in')
        return
      }
      
      console.log('✅ Authenticated as:', user.email)
      setDebugInfo(`✅ Authenticated as: ${user.email}`)
      
      // Check session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      if (sessionError) {
        console.error('❌ Session error:', sessionError)
        setDebugInfo(`❌ Session Error: ${sessionError.message}`)
      } else if (session) {
        console.log('✅ Active session found')
        setDebugInfo(`✅ Active session - User ID: ${user.id}`)
      } else {
        console.warn('⚠️ No active session')
        setDebugInfo('⚠️ No active session - this might cause RLS issues')
      }
      
      // Clear debug info after 8 seconds
      setTimeout(() => setDebugInfo(null), 8000)
      
    } catch (error) {
      console.error('Error checking authentication:', error)
      setDebugInfo(`Auth check error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  return (
    <div className="admin-properties-page">
      <div className="page-header">
        <div className="header-content">
           <div>
          <h2>Manage Properties</h2>
             <p className="properties-count">
               {properties.length} {properties.length === 1 ? 'property' : 'properties'} loaded
             </p>
           </div>
                       <div className="header-actions">
              <button 
                onClick={fetchProperties} 
                className="btn-secondary"
                title="Refresh Properties"
                disabled={isRefreshing}
              >
                <IoSearchOutline />
                {isRefreshing ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>
        </div>
        <Link href="/admin/add-property" className="btn-primary">
          <IoAddOutline />
          Add Property
        </Link>
      </div>

                     {/* Success Message */}
        {successMessage && (
          <div className="success-banner">
            <span>✅</span>
            {successMessage}
          </div>
        )}



       {/* Search and Filter */}
       <div className="search-filter-section">
        <div className="search-box">
          <IoSearchOutline />
          <input
            type="text"
            placeholder="Search properties..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-options">
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
            >
              <option value="all">All Properties</option>
              <option value="rent">For Rent</option>
              <option value="sale">For Sale</option>
            </select>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedProperties.length > 0 && (
        <div className="bulk-actions">
          <span>{selectedProperties.length} properties selected</span>
          <button
            className="btn-danger"
            onClick={handleDeleteSelected}
            disabled={isBulkDeleting}
          >
            <IoTrashOutline />
            {isBulkDeleting ? 'Deleting...' : 'Delete Selected'}
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && propertyToDelete && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete "{propertyToDelete.title}"? This action cannot be undone.</p>
            <div className="modal-actions">
              <button 
                className="btn-secondary" 
                onClick={cancelDelete}
                disabled={deletingProperties.has(propertyToDelete.id)}
              >
                Cancel
              </button>
              <button 
                className="btn-danger" 
                onClick={confirmDeleteProperty}
                disabled={deletingProperties.has(propertyToDelete.id)}
              >
                {deletingProperties.has(propertyToDelete.id) ? 'Deleting...' : 'Delete Property'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Properties Table */}
      <div className="properties-table-container">
        <table className="properties-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selectedProperties.length === filteredProperties.length}
                  onChange={handleSelectAll}
                />
              </th>
              <th onClick={() => handleSort('id')} className="sortable">
                ID {sortBy === 'id' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('title')} className="sortable">
                Property {sortBy === 'title' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('location')} className="sortable">
                Location {sortBy === 'location' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('price')} className="sortable">
                Price {sortBy === 'price' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
                             <th>Type</th>
               <th>Actions</th>
            </tr>
          </thead>
          <tbody>
                         {filteredProperties.map((property) => (
               <tr key={property.id} className="property-row">
                 <td>
                   <input
                     type="checkbox"
                     checked={selectedProperties.includes(property.id)}
                     onChange={() => handleSelectProperty(property.id)}
                   />
                 </td>
                 <td>{property.id}</td>
                 <td>
                   <Link 
                     href={`/properties/${property.slug}`} 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="property-link"
                   >
                     <div className="property-info">
                       <Image 
                         src={property.image} 
                         alt={property.title} 
                         className="property-thumbnail"
                         width={60}
                         height={60}
                        onError={(e) => {
                          console.error('Image failed to load:', property.image, e)
                          // Try to use the original Cloudinary URL if thumbnail fails
                          if (property.images && property.images.length > 0) {
                            console.log('Falling back to original image URL:', property.images[0].url)
                          }
                        }}
                       />
                       <div>
                         <h4>{property.title}</h4>
                         <p className="property-description">{property.description.substring(0, 60)}...</p>
                       </div>
                     </div>
                   </Link>
                 </td>
                 <td>
                   <Link 
                     href={`/properties/${property.slug}`} 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="property-link"
                   >
                     {property.location}
                   </Link>
                 </td>
                 <td>
                   <Link 
                     href={`/properties/${property.slug}`} 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="property-link"
                   >
                     <span className="price">{property.price}{property.period}</span>
                   </Link>
                 </td>
                 <td>
                   <Link 
                     href={`/properties/${property.slug}`} 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="property-link"
                   >
                    {property.propertyType || 'Apartment'}
                   </Link>
                 </td>
                 <td>
                   <div className="action-buttons">
                     <Link
                       href={`/admin/edit-property/${property.id}`}
                      className="btn-edit"
                       title="Edit Property"
                     >
                       <MdOutlineEdit />
                     </Link>
                     <button
                      className="btn-delete"
                       onClick={() => handleDeleteProperty(property.id, property.title)}
                       title="Delete Property"
                      disabled={deletingProperties.has(property.id)}
                     >
                      {deletingProperties.has(property.id) ? (
                        <span>Deleting...</span>
                      ) : (
                       <IoTrashOutline />
                      )}
                     </button>
                   </div>
                 </td>
               </tr>
             ))}
          </tbody>
        </table>
      </div>

      {filteredProperties.length === 0 && (
        <div className="no-properties">
          <p>No properties found matching your criteria.</p>
      </div>
      )}
    </div>
  )
}
