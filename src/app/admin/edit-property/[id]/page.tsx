'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Image from 'next/image'
import { IoCloudUploadOutline, IoCheckmarkCircleOutline, IoArrowBackOutline, IoCloseOutline } from 'react-icons/io5'
import { supabase } from '@/lib/supabase'
import { uploadImageToCloudinary, ImageUploadError } from '@/lib/imageUpload'

interface PropertyImage {
  id: string
  url: string
  file?: File
  isUploading?: boolean
  uploadProgress?: number
  cloudinaryData?: {
    id: string
    url: string
    publicId: string
    width: number
    height: number
    format: string
    size: number
  }
  is_primary?: boolean
  public_id?: string
}

interface FormData {
  title: string
  location: string
  price: string
  period: string
  badge: string
  badgeClass: string
  image: string
  description: string
  bedrooms: number
  bathrooms: number
  area: string
  areaUnit: string
  propertyType: string
  parking: string
  yearBuilt: string
  slug: string
}

interface PropertyData {
  id: number
  title: string
  location: string
  price: number
  period: string
  badge: string
  description: string
  bedrooms: number
  bathrooms: number
  area: number
  area_unit: string
  property_type: string
  parking: number
  year_built: number
  slug: string
  property_images?: Array<{
    url: string
    is_primary: boolean
    public_id?: string
  }>
}

export default function EditProperty() {
  const router = useRouter()
  const params = useParams()
  const propertyId = parseInt(params.id as string)
  console.log('URL params:', params)
  console.log('Parsed property ID:', propertyId)
  
  const [formData, setFormData] = useState<FormData>({
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
  
  const [images, setImages] = useState<PropertyImage[]>([])
  const [showSuccess, setShowSuccess] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [amenities, setAmenities] = useState<string[]>([])
  const [availableAmenities, setAvailableAmenities] = useState<string[]>([])
  const [newAmenity, setNewAmenity] = useState('')

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true)
        
        // Fetch the property data from Supabase
        console.log('Fetching property with ID:', propertyId)
        const { data: propertyData, error: fetchError } = await supabase
          .from('properties')
          .select(`
            *,
            property_images(url, is_primary, public_id)
          `)
          .eq('id', propertyId)
          .single()
        
        console.log('Property data fetched:', propertyData)
        console.log('Fetch error:', fetchError)

        if (fetchError) {
          console.error('Error fetching property:', fetchError)
          setError('Failed to load property data')
          return
        }

        if (!propertyData) {
          setError('Property not found')
          return
        }

        // Get the primary image URL
        const primaryImage = propertyData.property_images?.find((img: { is_primary: boolean; url: string }) => img.is_primary)?.url || 
                           propertyData.property_images?.[0]?.url || 
                           '/images/property-1.jpg'

        // Convert parking integer back to string for form display
        const parkingValue = (() => {
          switch (propertyData.parking) {
            case 1:
              return 'Yes'
            case 0:
              return 'No'
            case 2:
              return 'Street'
            case 3:
              return 'Garage'
            default:
              return 'No'
          }
        })()


        
        // Set form data
        setFormData({
          title: propertyData.title || '',
          location: propertyData.location || '',
          price: String(propertyData.price || ''),
          period: propertyData.period || '',
          badge: propertyData.badge || '',
          badgeClass: 'green', // Default value since badge_class doesn't exist in PropertyData
          image: primaryImage,
          description: propertyData.description || '',
          bedrooms: propertyData.bedrooms || 0,
          bathrooms: propertyData.bathrooms || 0,
          area: String(propertyData.area || ''),
          areaUnit: propertyData.area_unit || 'sq ft',
          propertyType: propertyData.property_type || '',
          parking: parkingValue,
          yearBuilt: String(propertyData.year_built || ''),
          slug: propertyData.slug || ''
        })

        // Set existing images
        if (propertyData.property_images && propertyData.property_images.length > 0) {
          const existingImages: PropertyImage[] = propertyData.property_images.map((img: { url: string; is_primary: boolean; public_id?: string }, index: number) => ({
            id: `existing-${index}`,
            url: img.url,
            is_primary: img.is_primary,
            public_id: img.public_id
          }))
          setImages(existingImages)
        }

        // Fetch amenities for this property
        console.log('Fetching amenities for edit form, property ID:', propertyId)
        const { data: amenitiesData, error: amenitiesError } = await supabase
          .from('property_amenities')
          .select(`
            amenity_id,
            amenities(name)
          `)
          .eq('property_id', propertyId)

        console.log('Edit form amenities data:', amenitiesData)
        console.log('Edit form amenities error:', amenitiesError)

        if (amenitiesData) {
          const propertyAmenities = amenitiesData.map((item: { amenities: { name: string }[] | { name: string } }) => {
            console.log('Processing amenity item:', item)
            if (item.amenities && Array.isArray(item.amenities)) {
              return item.amenities[0]?.name
            } else if (item.amenities && typeof item.amenities === 'object') {
              return (item.amenities as { name: string }).name
            }
            return null
          }).filter((name): name is string => name !== null)
          console.log('Edit form extracted amenities:', propertyAmenities)
          setAmenities(propertyAmenities)
        }

        // Fetch all available amenities for selection
        const { data: allAmenities } = await supabase
          .from('amenities')
          .select('name')
          .order('name')

        if (allAmenities) {
          setAvailableAmenities(allAmenities.map(a => a.name))
        }
      } catch (err) {
        console.error('Error in fetchProperty:', err)
        setError('An unexpected error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchProperty()
  }, [propertyId])

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
  }, [])

  const removeImage = (imageId: string) => {
    setImages(prev => {
      const image = prev.find(img => img.id === imageId)
      if (image?.url.startsWith('blob:')) {
        URL.revokeObjectURL(image.url)
      }
      return prev.filter(img => img.id !== imageId)
    })
  }

  const setPrimaryImage = (imageId: string) => {
    setImages(prev => prev.map(img => ({
      ...img,
      is_primary: img.id === imageId
    })))
  }

  const addAmenity = (amenityName: string) => {
    if (amenityName.trim() && !amenities.includes(amenityName.trim())) {
      setAmenities(prev => [...prev, amenityName.trim()])
    }
  }

  const removeAmenity = (amenityName: string) => {
    setAmenities(prev => prev.filter(a => a !== amenityName))
  }



  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    
    // Ensure proper types for different fields
    let processedValue: string | number
    if (name === 'bedrooms' || name === 'bathrooms') {
      processedValue = parseInt(value) || 0
    } else {
      // All other fields should be strings
      processedValue = String(value)
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: processedValue
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

  // Helper function to safely trim string values
  const safeTrim = (value: string | number): string => {
    if (typeof value === 'string') {
      return value.trim()
    }
    return String(value).trim()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      setError('') // Clear any previous errors
      
      // Form validation and processing
      
      // Validate required fields
      if (!safeTrim(formData.title)) {
        setError('Property title is required')
        setLoading(false)
        return
      }
      
      if (!safeTrim(formData.slug)) {
        setError('Property slug is required')
        setLoading(false)
        return
      }
      
      if (!safeTrim(formData.location)) {
        setError('Property location is required')
        setLoading(false)
        return
      }
      
      if (!safeTrim(formData.price)) {
        setError('Property price is required')
        setLoading(false)
        return
      }
      
      // Check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        setError('You must be logged in to update properties')
        return
      }
      
      // Convert parking string to integer based on the database schema
      let parkingValue: number
      switch (formData.parking) {
        case 'Yes':
          parkingValue = 1
          break
        case 'No':
          parkingValue = 0
          break
        case 'Street':
          parkingValue = 2
          break
        case 'Garage':
          parkingValue = 3
          break
        default:
          parkingValue = 0 // Default to No
      }
      
      // Update the property in Supabase
      const updateData = {
        title: formData.title,
        slug: formData.slug,
        location: formData.location,
        price: parseFloat(formData.price.replace(/[^\d.]/g, '')) || 0, // Convert price string to number, remove currency symbols
        period: formData.period,
        badge: formData.badge,
        badge_class: formData.badgeClass,
        description: formData.description,
        bedrooms: formData.bedrooms,
        bathrooms: formData.bathrooms,
        area: parseFloat(formData.area) || 0,
        area_unit: formData.areaUnit,
        property_type: formData.propertyType,
        parking: parkingValue,
        year_built: parseInt(formData.yearBuilt) || 0
      }
      
      // Update property in database
      console.log('Updating property with data:', updateData)
      
      const { error: updateError } = await supabase
        .from('properties')
        .update(updateData)
        .eq('id', propertyId)

      if (updateError) {
        // Log the error for debugging
        console.error('Supabase update error:', updateError)
        console.error('Error details:', {
          code: updateError.code,
          message: updateError.message,
          details: updateError.details,
          hint: updateError.hint
        })
        
        // Handle specific error types with user-friendly messages
        if (updateError.code === '23514') {
          setError('Validation error: One or more required fields are missing or invalid')
        } else if (updateError.code === '23505') {
          setError('Duplicate error: A property with this slug already exists')
        } else if (updateError.code === '23503') {
          setError('Reference error: Invalid reference to another table')
        } else if (updateError.code === '42P01') {
          setError('Table not found: The properties table does not exist')
        } else if (updateError.code === '42501') {
          setError('Permission denied: You do not have permission to update properties')
        } else {
          setError(`Failed to update property: ${updateError.message || updateError.details || 'Unknown error'}`)
        }
        return
      }

      // Handle image updates
      if (images.length > 0) {
        // First, delete existing images for this property
        const { error: deleteError } = await supabase
          .from('property_images')
          .delete()
          .eq('property_id', propertyId)

        if (deleteError) {
          console.error('Error deleting existing images:', deleteError)
          // Continue anyway, as the property was updated successfully
        }

        // Insert new images
        const imageInserts = images.map((img, index) => ({
          property_id: propertyId,
          url: img.url,
          thumbnail_url: img.url, // Use main URL for thumbnail
          medium_url: img.url,    // Use main URL for medium
          large_url: img.url,     // Use main URL for large
          public_id: img.cloudinaryData?.publicId || img.public_id,
          width: img.cloudinaryData?.width || 800,
          height: img.cloudinaryData?.height || 600,
          format: img.cloudinaryData?.format || 'jpg',
          size: img.cloudinaryData?.size || 0,
          is_primary: img.is_primary || index === 0, // First image is primary if none specified
          sort_order: index
        }))

        const { error: imagesError } = await supabase
          .from('property_images')
          .insert(imageInserts)

        if (imagesError) {
          console.error('Error saving images:', imagesError)
          // Continue anyway, as the property was updated successfully
        }
      }

      // Handle amenities updates
      console.log('Saving amenities:', amenities)
      
      // Always delete existing amenities first (whether adding new ones or clearing all)
      const { error: deleteAmenitiesError } = await supabase
        .from('property_amenities')
        .delete()
        .eq('property_id', propertyId)

      if (deleteAmenitiesError) {
        console.error('Error deleting existing amenities:', deleteAmenitiesError)
        // Continue anyway, as the property was updated successfully
      } else {
        console.log('Successfully deleted existing amenities')
      }

      // Insert new amenities if any exist
      if (amenities.length > 0) {
        console.log('Inserting new amenities:', amenities)
        
        for (const amenityName of amenities) {
          console.log('Processing amenity:', amenityName)
          
          // First, get or create the amenity
          let { data: amenity } = await supabase
            .from('amenities')
            .select('id')
            .eq('name', amenityName)
            .single()

          if (!amenity) {
            console.log('Creating new amenity:', amenityName)
            const { data: newAmenity, error: amenityError } = await supabase
              .from('amenities')
              .insert({ name: amenityName })
              .select('id')
              .single()

            if (amenityError) {
              console.error('Error creating amenity:', amenityError)
              continue
            }
            amenity = newAmenity
            console.log('Created amenity with ID:', amenity.id)
          } else {
            console.log('Found existing amenity:', amenity.id)
          }

          // Link property to amenity
          const { error: linkError } = await supabase
            .from('property_amenities')
            .insert({
              property_id: propertyId,
              amenity_id: amenity.id
            })

          if (linkError) {
            console.error('Error linking amenity:', linkError)
          } else {
            console.log('Successfully linked amenity:', amenityName)
          }
        }
      } else {
        console.log('No amenities to save - property will have no amenities')
      }
      
      setShowSuccess(true)
      
      // Redirect after 2 seconds
      setTimeout(() => {
        router.push('/admin/properties')
      }, 2000)
    } catch {
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
                  <option value="Yes">1 - Yes</option>
                  <option value="No">0 - No</option>
                  <option value="Street">2 - Street Parking</option>
                  <option value="Garage">3 - Garage</option>
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

        {/* Amenities Section */}
        <div className="form-section full-width">
          <h3>Amenities</h3>
          <div className="form-group">
            <label>Property Amenities</label>
            <p className="form-help">Add or remove amenities for this property</p>
            
            {/* Current Amenities */}
            {amenities.length > 0 && (
              <div className="current-amenities">
                <h4>Current Amenities ({amenities.length})</h4>
                <div className="amenities-list">
                  {amenities.map((amenity, index) => (
                    <div key={index} className="amenity-tag">
                      <span>{amenity}</span>
                      <button
                        type="button"
                        className="remove-amenity-btn"
                        onClick={() => removeAmenity(amenity)}
                        title="Remove amenity"
                      >
                        <IoCloseOutline />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add New Amenity */}
            <div className="add-amenity-section">
              <h4>Add New Amenity</h4>
              <div className="add-amenity-form">
                <div className="input-group">
                  <input
                    type="text"
                    value={newAmenity}
                    onChange={(e) => setNewAmenity(e.target.value)}
                    placeholder="Enter amenity name (e.g., Swimming Pool, Gym)"
                    className="amenity-input"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAmenity(newAmenity.trim()), setNewAmenity(''))}
                  />
                  <button 
                    type="button" 
                    className="btn-secondary"
                    onClick={() => {
                      if (newAmenity.trim()) {
                        addAmenity(newAmenity.trim())
                        setNewAmenity('')
                      }
                    }}
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>

            {/* Available Amenities */}
            {availableAmenities.length > 0 && (
              <div className="available-amenities">
                <h4>Quick Add from Available</h4>
                <div className="amenities-grid">
                  {availableAmenities
                    .filter(amenity => !amenities.includes(amenity))
                    .map((amenity, index) => (
                      <button
                        key={index}
                        type="button"
                        className="amenity-chip"
                        onClick={() => addAmenity(amenity)}
                      >
                        {amenity}
                      </button>
                    ))}
                </div>
              </div>
            )}
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
          <h3>Property Images</h3>
          <div className="form-group">
            <div className="image-upload-area">
              <input
                type="file"
                id="image-upload"
                className="file-input"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
              />
              <div className="upload-placeholder">
                <IoCloudUploadOutline />
                <p>Click to upload images</p>
                <span>or drag and drop multiple images</span>
              </div>
            </div>
          </div>

          {/* Image Gallery */}
          {images.length > 0 && (
            <div className="image-gallery">
              <h4>Current Images ({images.length})</h4>
              <div className="image-grid">
                {images.map((image, index) => (
                  <div key={image.id} className="image-item">
                    <div className="image-container">
                      <Image 
                        src={image.url} 
                        alt={`Property image ${index + 1}`} 
                        width={200}
                        height={150}
                        className="property-image"
                      />
                      
                      {/* Upload Progress */}
                      {image.isUploading && (
                        <div className="upload-progress">
                          <div className="progress-bar">
                            <div 
                              className="progress-fill" 
                              style={{ width: `${image.uploadProgress || 0}%` }}
                            ></div>
                          </div>
                          <span>{image.uploadProgress || 0}%</span>
                        </div>
                      )}
                      
                      {/* Primary Image Badge */}
                      {image.is_primary && (
                        <div className="primary-badge">Primary</div>
                      )}
                      
                      {/* Remove Button */}
                      <button
                        type="button"
                        className="remove-image-btn"
                        onClick={() => removeImage(image.id)}
                        title="Remove image"
                      >
                        <IoCloseOutline />
                      </button>
                    </div>
                    
                    <div className="image-actions">
                      <button
                        type="button"
                        className={`btn-secondary ${image.is_primary ? 'active' : ''}`}
                        onClick={() => setPrimaryImage(image.id)}
                        disabled={image.isUploading}
                      >
                        {image.is_primary ? 'Primary' : 'Set Primary'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="image-info">
                <p>
                  <strong>Primary Image:</strong> The first image shown in property listings
                </p>
                <p>
                  <strong>Image Order:</strong> Images are displayed in the order they appear above
                </p>
              </div>
            </div>
          )}
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
