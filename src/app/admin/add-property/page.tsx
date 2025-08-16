'use client'
import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { IoCloudUploadOutline, IoCheckmarkCircleOutline, IoClose, IoAdd, IoWarning } from 'react-icons/io5'
import { uploadImageToCloudinary, UploadedImage, ImageUploadError, imageUtils } from '@/lib/imageUpload'
import { supabase } from '@/lib/supabase'

interface PropertyImage {
  id: string
  url: string
  file?: File
  isUploading?: boolean
  uploadProgress?: number
  cloudinaryData?: UploadedImage
}

export default function AddProperty() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    price: '',
    period: '/Month',
    badge: 'For Rent',
    badgeClass: 'green',
    description: '',
    bedrooms: 1,
    bathrooms: 1,
    area: '',
    areaUnit: 'Square Ft',
    slug: '',
    amenities: [] as string[],
    propertyType: 'Apartment',
    parking: 0,
    yearBuilt: new Date().getFullYear()
  })
  
  const [images, setImages] = useState<PropertyImage[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [amenityInput, setAmenityInput] = useState('')

  const amenitiesList = [
    'Balcony', 'Garden', 'Swimming Pool', 'Gym', 'Security', 'Lift', 'Parking',
    'Air Conditioning', 'Heating', 'Furnished', 'Pet Friendly',
    'Terrace', 'Storage', 'Playground', 'Clubhouse', 'Maintenance Staff'
  ]

  const propertyTypes = [
    'Apartment', 'Villa', 'House', 'Penthouse', 'Studio', 'Duplex', 'Townhouse',
    'Farmhouse', 'Bungalow', 'Condo'
  ]

  // Clean up any duplicate amenities on component mount
  useEffect(() => {
    cleanupAmenities()
  }, []) // Empty dependency array means this runs once on mount

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.title.trim()) newErrors.title = 'Title is required'
    if (!formData.location.trim()) newErrors.location = 'Location is required'
    if (!formData.price.trim()) newErrors.price = 'Price is required'
    if (!formData.description.trim()) newErrors.description = 'Description is required'
    if (formData.bedrooms < 1) newErrors.bedrooms = 'Bedrooms must be at least 1'
    if (formData.bathrooms < 1) newErrors.bathrooms = 'Bathrooms must be at least 1'
    if (!formData.area.trim()) newErrors.area = 'Area is required'
    if (images.length === 0) newErrors.images = 'At least one image is required'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

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

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const numValue = parseInt(value) || 0
    setFormData(prev => ({
      ...prev,
      [name]: numValue
    }))
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    
    for (const file of files) {
      const imageId = Math.random().toString(36).substr(2, 9)
      
      try {
        const newImage: PropertyImage = {
          id: imageId,
          url: URL.createObjectURL(file),
          file: file,
          isUploading: true,
          uploadProgress: 0
        }
        
        setImages(prev => [...prev, newImage])

        // Upload to Cloudinary
        const cloudinaryResult = await uploadImageToCloudinary(file, (progress) => {
          setImages(prev => prev.map(img => 
            img.id === imageId 
              ? { ...img, uploadProgress: progress.percentage }
              : img
          ))
        })

        // Update image with Cloudinary data
        setImages(prev => prev.map(img => 
          img.id === imageId 
            ? { 
                ...img, 
                isUploading: false, 
                uploadProgress: 100,
                cloudinaryData: cloudinaryResult,
                url: cloudinaryResult.url // Use Cloudinary URL instead of blob
              }
            : img
        ))

        // Clear error when images are added
        if (errors.images) {
          setErrors(prev => ({ ...prev, images: '' }))
        }

      } catch (error) {
        console.error('Image upload failed:', error)
        
        // Remove failed image and show error
        setImages(prev => prev.filter(img => img.id !== imageId))
        
        if (error instanceof ImageUploadError) {
          alert(`Failed to upload ${file.name}: ${error.message}`)
        } else {
          alert(`Failed to upload ${file.name}. Please try again.`)
        }
      }
    }
  }, [errors.images])

  const removeImage = (imageId: string) => {
    setImages(prev => {
      const image = prev.find(img => img.id === imageId)
      if (image?.url.startsWith('blob:')) {
        URL.revokeObjectURL(image.url)
      }
      return prev.filter(img => img.id !== imageId)
    })
  }

  const addAmenity = () => {
    const trimmedAmenity = amenityInput.trim()
    if (trimmedAmenity && !formData.amenities.includes(trimmedAmenity)) {
      setFormData(prev => ({
        ...prev,
        amenities: [...prev.amenities, trimmedAmenity]
      }))
      setAmenityInput('')
    }
  }

  const removeAmenity = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.filter(a => a !== amenity)
    }))
  }

  // Clean up any duplicate amenities that might exist
  const cleanupAmenities = () => {
    setFormData(prev => ({
      ...prev,
      amenities: [...new Set(prev.amenities)] // Remove duplicates using Set
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Prepare property data with image information
      const propertyData = {
        ...formData,
        // Set the main image to the first uploaded image or a default
        image: images.length > 0 && images[0].cloudinaryData?.url 
          ? (() => {
              try {
                return imageUtils.getThumbnail(images[0].cloudinaryData.url, 150)
              } catch (error) {
                console.warn('Failed to generate thumbnail, using original URL:', error)
                return images[0].cloudinaryData.url
              }
            })()
          : '/images/property-1.jpg',
        images: images.map(img => ({
          url: img.cloudinaryData?.url || img.url,
          thumbnailUrl: img.cloudinaryData?.url ? imageUtils.getThumbnail(img.cloudinaryData.url, 150) : img.url,
          mediumUrl: img.cloudinaryData?.url ? imageUtils.getMedium(img.cloudinaryData.url, 400) : img.url,
          largeUrl: img.cloudinaryData?.url ? imageUtils.getLarge(img.cloudinaryData.url, 800) : img.url,
          publicId: img.cloudinaryData?.publicId,
          width: img.cloudinaryData?.width,
          height: img.cloudinaryData?.height,
          format: img.cloudinaryData?.format,
          size: img.cloudinaryData?.size
        }))
      }

      console.log('New Property Data:', propertyData)
      
      // Save the property to Supabase
      const { data: savedProperty, error: propertyError } = await supabase
        .from('properties')
        .insert({
          title: propertyData.title,
          slug: propertyData.slug,
          description: propertyData.description,
          price: parseFloat(propertyData.price),
          period: propertyData.period,
          badge: propertyData.badge,
          badge_class: propertyData.badgeClass,
          bedrooms: propertyData.bedrooms,
          bathrooms: propertyData.bathrooms,
          area: parseFloat(propertyData.area),
          area_unit: propertyData.areaUnit,
          property_type: propertyData.propertyType,
          parking: propertyData.parking,
          year_built: propertyData.yearBuilt,
          location: propertyData.location
        })
        .select()
        .single()

      if (propertyError) {
        throw new Error(`Failed to save property: ${propertyError.message}`)
      }

      console.log('Property saved to Supabase:', savedProperty)

      // Save property images to Supabase
      if (propertyData.images.length > 0) {
        const imageInserts = propertyData.images.map((img, index) => ({
          property_id: savedProperty.id,
          url: img.url,
          thumbnail_url: img.thumbnailUrl,
          medium_url: img.mediumUrl,
          large_url: img.largeUrl,
          public_id: img.publicId,
          width: img.width,
          height: img.height,
          format: img.format,
          size: img.size,
          is_primary: index === 0, // First image is primary
          sort_order: index
        }))

        const { error: imagesError } = await supabase
          .from('property_images')
          .insert(imageInserts)

        if (imagesError) {
          console.error('Failed to save images:', imagesError)
        } else {
          console.log('Images saved to Supabase')
        }
      }

      // Save amenities to Supabase
      if (propertyData.amenities.length > 0) {
        for (const amenityName of propertyData.amenities) {
          // First, get or create the amenity
          let { data: amenity } = await supabase
            .from('amenities')
            .select('id')
            .eq('name', amenityName)
            .single()

          if (!amenity) {
            const { data: newAmenity, error } = await supabase
              .from('amenities')
              .insert({ name: amenityName })
              .select('id')
              .single()

            if (error) {
              console.error(`Failed to create amenity ${amenityName}:`, error)
              continue
            }
            amenity = newAmenity
          }

          // Link property to amenity
          const { error } = await supabase
            .from('property_amenities')
            .insert({
              property_id: savedProperty.id,
              amenity_id: amenity.id
            })

          if (error) {
            console.error(`Failed to link amenity ${amenityName}:`, error)
          }
        }
      }
      
      setIsSubmitting(false)
      setShowSuccess(true)
      
      // Redirect after 2 seconds with refresh parameter
      setTimeout(() => {
        router.push('/admin/properties?refresh=true')
      }, 2000)
    } catch (error) {
      console.error('Error adding property:', error)
      setIsSubmitting(false)
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
                className={errors.title ? 'error' : ''}
                required
              />
              {errors.title && <span className="error-message">{errors.title}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="propertyType">Property Type</label>
              <select
                id="propertyType"
                name="propertyType"
                value={formData.propertyType}
                onChange={handleInputChange}
              >
                {propertyTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
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
                className={errors.location ? 'error' : ''}
                required
              />
              {errors.location && <span className="error-message">{errors.location}</span>}
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
                  className={errors.price ? 'error' : ''}
                  required
                />
                {errors.price && <span className="error-message">{errors.price}</span>}
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
                  onChange={handleNumberInputChange}
                  min="1"
                  max="10"
                  className={errors.bedrooms ? 'error' : ''}
                  required
                />
                {errors.bedrooms && <span className="error-message">{errors.bedrooms}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="bathrooms">Bathrooms *</label>
                <input
                  type="number"
                  id="bathrooms"
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleNumberInputChange}
                  min="1"
                  max="10"
                  className={errors.bathrooms ? 'error' : ''}
                  required
                />
                {errors.bathrooms && <span className="error-message">{errors.bathrooms}</span>}
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
                  className={errors.area ? 'error' : ''}
                  required
                />
                {errors.area && <span className="error-message">{errors.area}</span>}
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

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="parking">Parking Spaces</label>
                <input
                  type="number"
                  id="parking"
                  name="parking"
                  value={formData.parking}
                  onChange={handleNumberInputChange}
                  min="0"
                  max="10"
                />
              </div>

              <div className="form-group">
                <label htmlFor="yearBuilt">Year Built</label>
                <input
                  type="number"
                  id="yearBuilt"
                  name="yearBuilt"
                  value={formData.yearBuilt}
                  onChange={handleNumberInputChange}
                  min="1900"
                  max={new Date().getFullYear() + 1}
                />
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

          {/* Amenities */}
          <div className="form-section">
            <h3>Amenities & Features</h3>
            
            <div className="form-group">
              <label>Add Amenities</label>
              <div className="amenity-input-group">
                <input
                  type="text"
                  value={amenityInput}
                  onChange={(e) => setAmenityInput(e.target.value)}
                  placeholder="Type an amenity and click +"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAmenity())}
                />
                <button
                  type="button"
                  onClick={addAmenity}
                  className="btn-add-amenity"
                >
                  <IoAdd />
                </button>
              </div>
            </div>

            {formData.amenities.length > 0 && (
              <div className="amenities-list">
                {formData.amenities.map((amenity, index) => (
                  <span key={`${amenity}-${index}`} className="amenity-tag">
                    {amenity}
                    <button
                      type="button"
                      onClick={() => removeAmenity(amenity)}
                      className="remove-amenity"
                    >
                      <IoClose />
                    </button>
                  </span>
                ))}
              </div>
            )}

            <div className="quick-amenities">
              <label>Quick Add Common Amenities:</label>
              <div className="quick-amenities-grid">
                {amenitiesList.map(amenity => (
                  <button
                    key={`quick-${amenity}`}
                    type="button"
                    onClick={() => {
                      if (!formData.amenities.includes(amenity)) {
                        setFormData(prev => ({
                          ...prev,
                          amenities: [...prev.amenities, amenity]
                        }))
                      }
                    }}
                    className={`quick-amenity-btn ${formData.amenities.includes(amenity) ? 'selected' : ''}`}
                    disabled={formData.amenities.includes(amenity)}
                  >
                    {amenity}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Description & Images */}
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
                className={errors.description ? 'error' : ''}
                required
              />
              {errors.description && <span className="error-message">{errors.description}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="images">Property Images *</label>
              <div className="image-upload-area">
                <input
                  type="file"
                  id="images"
                  name="images"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="file-input"
                />
                <div className="upload-placeholder">
                  <IoCloudUploadOutline />
                  <p>Click to upload or drag and drop</p>
                  <span>PNG, JPG, GIF up to 10MB each</span>
                  <small>You can select multiple images</small>
                </div>
              </div>
              {errors.images && <span className="error-message">{errors.images}</span>}
              
              {images.length > 0 && (
                <div className="images-preview">
                  <h4>Property Images ({images.length})</h4>
                  <div className="images-grid">
                    {images.map((image) => (
                      <div key={image.id} className="image-preview-item">
                        <Image 
                          src={image.cloudinaryData?.url ? imageUtils.getThumbnail(image.cloudinaryData.url, 150) : image.url} 
                          alt="Property preview" 
                          width={150}
                          height={120}
                          className="preview-image"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(image.id)}
                          className="remove-image-btn"
                          title="Remove image"
                        >
                          <IoClose />
                        </button>
                        
                        {/* Upload Progress */}
                        {image.isUploading && (
                          <div className="uploading-overlay">
                            <div className="spinner"></div>
                            <span>Uploading... {image.uploadProgress}%</span>
                          </div>
                        )}
                        
                        {/* Upload Success Indicator */}
                        {!image.isUploading && image.cloudinaryData && (
                          <div className="upload-success-indicator">
                            <IoCheckmarkCircleOutline />
                          </div>
                        )}
                        
                        {/* Upload Failed Indicator */}
                        {!image.isUploading && !image.cloudinaryData && image.uploadProgress === 0 && (
                          <div className="upload-failed-indicator">
                            <IoWarning />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  <div className="images-info">
                    <small>First image will be the main property image</small>
                    {images.some(img => img.cloudinaryData) && (
                      <small className="cloudinary-info">
                        ✓ Images are optimized and stored securely in the cloud
                      </small>
                    )}
                  </div>
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
