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
      let aValue = a[sortBy as keyof Property]
      let bValue = b[sortBy as keyof Property]

      // Handle undefined values
      if (aValue === undefined) aValue = ''
      if (bValue === undefined) bValue = ''

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1
      return 0
    })

    return filtered
  }, [properties, searchTerm, selectedFilter, sortBy, sortOrder])

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

        for (const id of selectedProperties) {
          try {
            setDeletingProperties(prev => new Set(prev).add(id))
            
            // Delete property images first
            await supabase
              .from('property_images')
              .delete()
              .eq('property_id', id)

            // Delete property amenities
            await supabase
              .from('property_amenities')
              .delete()
              .eq('property_id', id)

            // Finally delete the property
            await supabase
              .from('properties')
              .delete()
              .eq('id', id)

            deletedIds.push(id)
          } catch (error) {
            console.error(`Error deleting property ${id}:`, error)
            failedDeletions.push(`Property ID ${id}`)
          }
        }

        // Update local state
        setProperties(prev => {
          const newProperties = prev.filter(p => !selectedProperties.includes(p.id))
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
      }

      // Delete property amenities
      const { error: amenitiesError } = await supabase
        .from('property_amenities')
        .delete()
        .eq('property_id', propertyToDelete.id)

      if (amenitiesError) {
        console.error('Error deleting property amenities:', amenitiesError)
        deletionSuccessful = false
      }

      // Finally delete the property
      const { error: propertyError } = await supabase
        .from('properties')
        .delete()
        .eq('id', propertyToDelete.id)

      if (propertyError) {
        console.error('Error deleting property:', propertyError)
        deletionSuccessful = false
        throw new Error(`Failed to delete property: ${propertyError.message}`)
      }

      // Check if the property was actually deleted by querying immediately
      const { data: immediateCheck } = await supabase
        .from('properties')
        .select('id')
        .eq('id', propertyToDelete.id)
        .single()

      let verificationSuccessful = false
      if (immediateCheck) {
        // Property still exists, wait a bit and try again
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Try verification again
        const { data: verificationCheck } = await supabase
          .from('properties')
          .select('id')
          .eq('id', propertyToDelete.id)
          .single()

        if (verificationCheck) {
          // Property still exists after delay
          verificationSuccessful = false
        } else {
          verificationSuccessful = true
        }
      } else {
        verificationSuccessful = true
      }

      if (verificationSuccessful) {
        deletionSuccessful = true
      }

      if (deletionSuccessful) {
        // Remove from local state
        setProperties(prev => {
          const newProperties = prev.filter(p => p.id !== propertyToDelete.id)
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
          fetchProperties()
        }, 1000)
      } else {
        // Even if verification fails, we'll still remove from local state
        // but show a warning to the user
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
            <p>Are you sure you want to delete &quot;{propertyToDelete.title}&quot;? This action cannot be undone.</p>
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
