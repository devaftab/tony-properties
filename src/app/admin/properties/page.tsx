'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import { IoAddOutline, IoSearchOutline, IoTrashOutline } from 'react-icons/io5'
import {MdOutlineEdit} from 'react-icons/md'
import { allProperties, Property } from '../../data/properties'

export default function AdminProperties() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [sortBy, setSortBy] = useState('id')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [selectedProperties, setSelectedProperties] = useState<number[]>([])

  // Filter and search properties
  const filteredProperties = useMemo(() => {
    let filtered = allProperties

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
      let aValue: any = a[sortBy as keyof Property]
      let bValue: any = b[sortBy as keyof Property]

      if (sortBy === 'price') {
        aValue = parseInt(aValue.replace(/[^\d]/g, ''))
        bValue = parseInt(bValue.replace(/[^\d]/g, ''))
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1
      return 0
    })

    return filtered
  }, [searchTerm, selectedFilter, sortBy, sortOrder])

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

      {/* Filters and Search */}
      <div className="filters-section">
        <div className="search-box">
          <IoSearchOutline />
          <input
            type="text"
            placeholder="Search properties..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-controls">
          <div className="filter-group">
            <label>Type:</label>
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
            >
              <option value="all">All Properties</option>
              <option value="rent">For Rent</option>
              <option value="sale">For Sale</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => handleSort(e.target.value)}
            >
              <option value="id">ID</option>
              <option value="title">Title</option>
              <option value="price">Price</option>
              <option value="location">Location</option>
              <option value="bedrooms">Bedrooms</option>
            </select>
            <button
              className="sort-order-btn"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
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
                       <img src={property.image} alt={property.title} className="property-thumbnail" />
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
                     <span className={`badge ${property.badgeClass}`}>
                       {property.badge}
                     </span>
                   </Link>
                 </td>
                 <td>
                   <div className="action-buttons">
                     <Link
                       href={`/admin/edit-property/${property.id}`}
                       className="btn-icon edit"
                       title="Edit Property"
                     >
                       <MdOutlineEdit />
                     </Link>
                     <button
                       className="btn-icon delete"
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

      {/* Results Summary */}
      <div className="results-summary">
        <p>
          Showing {filteredProperties.length} of {allProperties.length} properties
        </p>
      </div>
    </div>
  )
}
