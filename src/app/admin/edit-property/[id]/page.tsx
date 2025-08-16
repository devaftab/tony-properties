'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Image from 'next/image'
import { IoCloudUploadOutline, IoCheckmarkCircleOutline, IoArrowBackOutline } from 'react-icons/io5'
import { supabase } from '@/lib/supabase'

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
    areaUnit: 'sq ft',
    propertyType: '',
    parking: '',
    yearBuilt: '',
    slug: ''
  })
  
  const [showSuccess, setShowSuccess] = useState(false)
  const [imagePreview, setImagePreview] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true)
        
        // Fetch the property data from Supabase
        const { data: property, error: fetchError } = await supabase
          .from('properties')
          .select(`
            *,
            property_images(url, is_primary)
          `)
          .eq('id', propertyId)
          .single()

        if (fetchError) {
          console.error('Error fetching property:', fetchError)
          setError('Failed to load property data')
          return
        }

        if (!property) {
          setError('Property not found')
          return
        }

        // Get the primary image URL
        const primaryImage = property.property_images?.find((img: any) => img.is_primary)?.url || 
                           property.property_images?.[0]?.url || 
                           '/images/property-1.jpg'

        setFormData({
          title: property.title || '',
          location: property.location || '',
          price: property.price || '',
          period: property.period || '',
          badge: property.badge || 'For Sale',
          badgeClass: property.period === '/Month' ? 'green' : 'orange',
          image: primaryImage,
          description: property.description || '',
          bedrooms: property.bedrooms || 0,
          bathrooms: property.bathrooms || 0,
          area: property.area || '',
          areaUnit: property.area_unit || 'sq ft',
          propertyType: property.property_type || '',
          parking: property.parking || '',
          yearBuilt: property.year_built || '',
          slug: property.slug || ''
        })
        
        setImagePreview(primaryImage)
      } catch (err) {
        console.error('Error in fetchProperty:', err)
        setError('An unexpected error occurred')
      } finally {
        setLoading(false)
      }
    }

    if (propertyId) {
      fetchProperty()
    }
  }, [propertyId])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'bedrooms' || name === 'bathrooms' ? parseInt(value) || 0 : value
    }))

    // Auto-generate slug from title
    if (name === 'title') {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
      
      setFormData(prev => ({
        ...prev,
        slug: slug
      }))
    }
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
    
    try {
      setLoading(true)
      
      console.log('🔄 Starting property update...', { propertyId, formData })
      
      // Check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser()
      console.log('👤 Current user:', user)
      
      if (!user) {
        setError('You must be logged in to update properties')
        return
      }
      
      // Update the property in Supabase
      const updateData = {
        title: formData.title,
        slug: formData.slug,
        location: formData.location,
        price: formData.price,
        period: formData.period,
        badge: formData.badge,
        description: formData.description,
        bedrooms: formData.bedrooms,
        bathrooms: formData.bathrooms,
        area: formData.area,
        area_unit: formData.areaUnit,
        property_type: formData.propertyType,
        parking: formData.parking,
        year_built: formData.yearBuilt,
        updated_at: new Date().toISOString()
      }
      
      console.log('📝 Update data being sent:', updateData)
      
      const { data: updateResult, error: updateError } = await supabase
        .from('properties')
        .update(updateData)
        .eq('id', propertyId)
        .select()

      console.log('📊 Update result:', updateResult)
      console.log('❌ Update error:', updateError)

      if (updateError) {
        console.error('❌ Error updating property:', updateError)
        setError(`Failed to update property: ${updateError.message}`)
        return
      }
      
      console.log('✅ Property updated successfully!')
      setShowSuccess(true)
      
      // Redirect after 2 seconds
      setTimeout(() => {
        router.push('/admin/properties')
      }, 2000)
    } catch (err) {
      console.error('❌ Error in handleSubmit:', err)
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
        <p>Loading property data...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="error-message">
        <p>{error}</p>
        <button onClick={() => router.push('/admin/properties')}>
          Back to Properties
        </button>
        <button 
          onClick={async () => {
            console.log('🧪 Testing property access...')
            const { data, error } = await supabase
              .from('properties')
              .select('*')
              .eq('id', propertyId)
              .single()
            console.log('📖 Read test result:', { data, error })
          }}
          style={{ marginLeft: '10px' }}
        >
          Test Property Access
        </button>
      </div>
    )
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
              <label htmlFor="slug">Property Slug *</label>
              <input
                type="text"
                id="slug"
                name="slug"
                value={formData.slug || ''}
                onChange={handleInputChange}
                required
                placeholder="e.g., modern-apartment-downtown"
              />
              <small>URL-friendly version of the title (auto-generated from title)</small>
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

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="propertyType">Property Type</label>
                <select
                  id="propertyType"
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleInputChange}
                >
                  <option value="">Select Type</option>
                  <option value="Apartment">Apartment</option>
                  <option value="House">House</option>
                  <option value="Villa">Villa</option>
                  <option value="Condo">Condo</option>
                  <option value="Townhouse">Townhouse</option>
                  <option value="Land">Land</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="parking">Parking</label>
                <select
                  id="parking"
                  name="parking"
                  value={formData.parking}
                  onChange={handleInputChange}
                >
                  <option value="">Select Parking</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                  <option value="Street">Street Parking</option>
                  <option value="Garage">Garage</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="yearBuilt">Year Built</label>
              <input
                type="number"
                id="yearBuilt"
                name="yearBuilt"
                value={formData.yearBuilt}
                onChange={handleInputChange}
                min="1900"
                max={new Date().getFullYear()}
                placeholder="e.g., 2020"
              />
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
