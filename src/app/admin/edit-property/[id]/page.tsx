'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Image from 'next/image'
import { IoCloudUploadOutline, IoCheckmarkCircleOutline, IoArrowBackOutline } from 'react-icons/io5'
import { allProperties } from '../../../data/properties'

export default function EditProperty() {
  const router = useRouter()
  const params = useParams()
  const propertyId = parseInt(params.id as string)
  
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    price: '',
    period: '',
    badge: '',
    badgeClass: '',
    image: '',
    description: '',
    bedrooms: 0,
    bathrooms: 0,
    area: '',
    areaUnit: 'sq ft'
  })
  
  const [showSuccess, setShowSuccess] = useState(false)
  const [imagePreview, setImagePreview] = useState('')

  useEffect(() => {
    // Find the property to edit
    const property = allProperties.find(p => p.id === propertyId)
    if (property) {
      setFormData({
        title: property.title,
        location: property.location,
        price: property.price,
        period: property.period,
        badge: property.badge,
        badgeClass: property.badgeClass,
        image: property.image,
        description: property.description,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        area: property.area,
        areaUnit: property.areaUnit
      })
      setImagePreview(property.image)
    } else {
      // Property not found, redirect back
      router.push('/admin/properties')
    }
  }, [propertyId, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'bedrooms' || name === 'bathrooms' ? parseInt(value) || 0 : value
    }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setImagePreview(result)
        setFormData(prev => ({ ...prev, image: result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setShowSuccess(true)
    
    // Redirect after 2 seconds
    setTimeout(() => {
      router.push('/admin/properties')
    }, 2000)
  }

  if (showSuccess) {
    return (
      <div className="success-message">
        <IoCheckmarkCircleOutline />
        <h2>Property Updated Successfully!</h2>
        <p>Redirecting to properties list...</p>
      </div>
    )
  }

  return (
    <div className="add-property-page">
      <div className="page-header">
        <button 
          onClick={() => router.back()} 
          className="btn-secondary"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}
        >
          <IoArrowBackOutline />
          Back to Properties
        </button>
        <h2>Edit Property</h2>
        <p>Update the property information below</p>
      </div>

      <form className="property-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          {/* Basic Information */}
          <div className="form-section">
            <h3>Basic Information</h3>
            
            <div className="form-group">
              <label htmlFor="title">Property Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="location">Location *</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="price">Price *</label>
                <input
                  type="text"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="period">Period</label>
                <select
                  id="period"
                  name="period"
                  value={formData.period}
                  onChange={handleInputChange}
                >
                  <option value="">For Sale</option>
                  <option value="/Month">For Rent (Monthly)</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="badge">Listing Type</label>
                <input
                  type="text"
                  id="badge"
                  name="badge"
                  value={formData.badge}
                  onChange={handleInputChange}
                  placeholder="e.g., For Rent, For Sale"
                />
              </div>

              <div className="form-group">
                <label htmlFor="badgeClass">Badge Color</label>
                <select
                  id="badgeClass"
                  name="badgeClass"
                  value={formData.badgeClass}
                  onChange={handleInputChange}
                >
                  <option value="green">Green</option>
                  <option value="orange">Orange</option>
                </select>
              </div>
            </div>
          </div>

          {/* Property Details */}
          <div className="form-section">
            <h3>Property Details</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="bedrooms">Bedrooms</label>
                <input
                  type="number"
                  id="bedrooms"
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleInputChange}
                  min="0"
                />
              </div>

              <div className="form-group">
                <label htmlFor="bathrooms">Bathrooms</label>
                <input
                  type="number"
                  id="bathrooms"
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleInputChange}
                  min="0"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="area">Area</label>
                <input
                  type="text"
                  id="area"
                  name="area"
                  value={formData.area}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="areaUnit">Area Unit</label>
                <select
                  id="areaUnit"
                  name="areaUnit"
                  value={formData.areaUnit}
                  onChange={handleInputChange}
                >
                  <option value="sq ft">Square Feet</option>
                  <option value="sq m">Square Meters</option>
                  <option value="acres">Acres</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="form-section full-width">
          <h3>Description</h3>
          <div className="form-group">
            <label htmlFor="description">Property Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              placeholder="Describe the property features, amenities, and highlights..."
            />
          </div>
        </div>

        {/* Image Upload */}
        <div className="form-section full-width">
          <h3>Property Image</h3>
          <div className="form-group">
            <div className="image-upload-area" onClick={() => document.getElementById('image-upload')?.click()}>
              <input
                type="file"
                id="image-upload"
                className="file-input"
                accept="image/*"
                onChange={handleImageUpload}
              />
              {imagePreview ? (
                <div className="image-preview">
                  <Image 
                    src={imagePreview} 
                    alt="Property preview" 
                    width={200}
                    height={150}
                  />
                </div>
              ) : (
                <div className="upload-placeholder">
                  <IoCloudUploadOutline />
                  <p>Click to upload image</p>
                  <span>or drag and drop</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={() => router.back()}>
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            Update Property
          </button>
        </div>
      </form>
    </div>
  )
}
