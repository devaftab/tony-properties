'use client'
import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { IoAddOutline, IoSearchOutline, IoTrashOutline } from 'react-icons/io5'
import {MdOutlineEdit} from 'react-icons/md'
import { allProperties, Property, loadPropertiesFromStorage } from '../../data/properties'


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

  // Load properties from storage when component mounts
  useEffect(() => {
    const loadedProperties = loadPropertiesFromStorage()
    
    // Fallback: if no properties loaded, use allProperties directly
    if (!loadedProperties || loadedProperties.length === 0) {
      setProperties(allProperties)
    } else {
      setProperties(loadedProperties)
    }
  }, [])

  // Update properties when refresh parameter changes
  useEffect(() => {
    if (refreshKey) {
      const loadedProperties = loadPropertiesFromStorage()
      setProperties(loadedProperties)
    }
  }, [refreshKey])

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

  const handleDeleteSelected = () => {
    if (confirm(`Are you sure you want to delete ${selectedProperties.length} properties?`)) {
      // In a real app, you would call your API to delete these properties
      console.log('Deleting properties:', selectedProperties)
      setSelectedProperties([])
    }
  }

  const handleDeleteProperty = (id: number, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      // In a real app, you would call your API to delete this property
      console.log('Deleting property:', id)
    }
  }

  return (
    <div className="admin-properties-page">
      <div className="page-header">
        <div className="header-content">
          <h2>Manage Properties</h2>
        </div>
        <Link href="/admin/add-property" className="btn-primary">
          <IoAddOutline />
          Add Property
        </Link>
      </div>

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
          >
            <IoTrashOutline />
            Delete Selected
          </button>
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
                    >
                      <IoTrashOutline />
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
