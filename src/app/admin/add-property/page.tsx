'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { IoCloudUploadOutline, IoCheckmarkCircleOutline } from 'react-icons/io5'

export default function AddProperty() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    price: '',
    period: '/Month',
    badge: 'For Rent',
    badgeClass: 'green',
    image: '',
    description: '',
    bedrooms: 1,
    bathrooms: 1,
    area: '',
    areaUnit: 'Square Ft',
    slug: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // Auto-generate slug from title
    if (name === 'title') {
      const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      setFormData(prev => ({
        ...prev,
        slug
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    // In a real app, you would send this data to your API
    console.log('New Property Data:', formData)
    
    setIsSubmitting(false)
    setShowSuccess(true)
    
    // Redirect after 2 seconds
    setTimeout(() => {
      router.push('/admin/properties')
    }, 2000)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // In a real app, you would upload to a cloud service
      const reader = new FileReader()
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          image: e.target?.result as string
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  if (showSuccess) {
    return (
      <div className="success-message">
        <IoCheckmarkCircleOutline />
        <h2>Property Added Successfully!</h2>
        <p>Redirecting to properties list...</p>
      </div>
    )
  }

  return (
    <div className="add-property-page">
      <div className="page-header">
        <h2>Add New Property</h2>
        <p>Create a new property listing for your portfolio</p>
      </div>

      <form onSubmit={handleSubmit} className="property-form">
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
                placeholder="e.g., 3BHK Apartment in Janakpuri"
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
                placeholder="e.g., B2 Janakpuri, New Delhi"
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
                  placeholder="e.g., ₹34,900"
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
                  <option value="/Month">Per Month</option>
                  <option value="">One Time</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="badge">Listing Type *</label>
                <select
                  id="badge"
                  name="badge"
                  value={formData.badge}
                  onChange={handleInputChange}
                  required
                >
                  <option value="For Rent">For Rent</option>
                  <option value="For Sales">For Sale</option>
                </select>
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
                  <option value="blue">Blue</option>
                </select>
              </div>
            </div>
          </div>

          {/* Property Details */}
          <div className="form-section">
            <h3>Property Details</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="bedrooms">Bedrooms *</label>
                <input
                  type="number"
                  id="bedrooms"
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleInputChange}
                  min="1"
                  max="10"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="bathrooms">Bathrooms *</label>
                <input
                  type="number"
                  id="bathrooms"
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleInputChange}
                  min="1"
                  max="10"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="area">Area *</label>
                <input
                  type="text"
                  id="area"
                  name="area"
                  value={formData.area}
                  onChange={handleInputChange}
                  placeholder="e.g., 3450"
                  required
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
                  <option value="Square Ft">Square Feet</option>
                  <option value="Square yards">Square Yards</option>
                  <option value="Square meters">Square Meters</option>
                  <option value="Acres">Acres</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="slug">URL Slug</label>
              <input
                type="text"
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                placeholder="auto-generated from title"
                readOnly
              />
              <small>This will be auto-generated from the title</small>
            </div>
          </div>

          {/* Description & Image */}
          <div className="form-section full-width">
            <h3>Description & Media</h3>
            
            <div className="form-group">
              <label htmlFor="description">Property Description *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe the property, its features, amenities, and what makes it special..."
                rows={4}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="image">Property Image</label>
              <div className="image-upload-area">
                <input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="file-input"
                />
                <div className="upload-placeholder">
                  <IoCloudUploadOutline />
                  <p>Click to upload or drag and drop</p>
                  <span>PNG, JPG, GIF up to 10MB</span>
                </div>
              </div>
              {formData.image && (
                <div className="image-preview">
                  <img src={formData.image} alt="Preview" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button
            type="button"
            className="btn-secondary"
            onClick={() => router.back()}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Adding Property...' : 'Add Property'}
          </button>
        </div>
      </form>
    </div>
  )
}
