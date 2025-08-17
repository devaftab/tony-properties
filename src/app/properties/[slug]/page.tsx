'use client'
import Image from 'next/image'
import Link from 'next/link'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { IoLocationOutline, IoBedOutline, IoCheckmarkCircleOutline } from 'react-icons/io5'
import { supabase } from '@/lib/supabase'
import { useEffect, useState, use } from 'react'
import { useCallback } from 'react'

interface PropertyPageProps {
  params: Promise<{ slug: string }>
}

interface Property {
  id: string;
  title: string;
  slug: string;
  location: string;
  price: string;
  period: string;
  badge: string;
  badge_class: string;
  description: string;
  longDescription?: string;
  specs?: { icon: string; value: string; label: string }[];
  amenities?: string[];
  highlights?: string[];
  locationInfo?: string[];
  image: string;
  images: { url: string; isPrimary: boolean }[];
  bedrooms?: number;
  bathrooms?: number;
  area?: string;
  area_unit?: string;
  property_type?: string;
  parking?: string;
  year_built?: string;
}

export default function PropertyPage({ params }: PropertyPageProps) {
  const { slug } = use(params)
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showGalleryModal, setShowGalleryModal] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  const fetchProperty = useCallback(async () => {
    if (!slug) return
    
    try {
      setLoading(true)
      setError(null)
      
      // Fetch the property data from Supabase
      const { data: propertyData, error: fetchError } = await supabase
        .from('properties')
        .select(`
          *,
          property_images(url, is_primary)
        `)
        .eq('slug', slug)
        .single()

      if (fetchError) {
        console.error('Error fetching property:', fetchError)
        setError('Property not found')
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

      // Transform the data to match the Property interface
      const transformedProperty: Property = {
        ...propertyData,
        image: primaryImage,
        images: propertyData.property_images?.map((img: { url: string; is_primary: boolean }) => ({
          url: img.url,
          isPrimary: img.is_primary
        })) || []
      }

      setProperty(transformedProperty)
    } catch (err) {
      console.error('Error in fetchProperty:', err)
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }, [slug])

  useEffect(() => {
    if (slug) {
      fetchProperty()
    }
  }, [slug, fetchProperty])

  // Keyboard navigation for gallery modal
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!showGalleryModal || !property?.images) return
      
      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault()
          setSelectedImageIndex(prev => 
            prev === 0 ? property.images.length - 1 : prev - 1
          )
          break
        case 'ArrowRight':
          event.preventDefault()
          setSelectedImageIndex(prev => 
            prev === property.images.length - 1 ? 0 : prev + 1
          )
          break
        case 'Escape':
          setShowGalleryModal(false)
          break
      }
    }

    if (showGalleryModal) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden' // Prevent background scrolling
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset' // Restore scrolling
    }
  }, [showGalleryModal, property?.images])


  // Loading state - check this FIRST
  if (loading) {
    return (
      <>
        <Header />
        <div style={{ padding: '100px 20px', textAlign: 'center' }}>
          <h1>Loading Property...</h1>
          <p>Please wait while we fetch the property details.</p>
        </div>
        <Footer />
      </>
    )
  }

  // Error state - check this SECOND
  if (error || !property) {
    return (
      <>
        <Header />
        <div style={{ padding: '100px 20px', textAlign: 'center' }}>
          <h1>Property Not Found</h1>
          <p>{error || 'The property you&apos;re looking for doesn&apos;t exist.'}</p>
          <Link href="/properties" style={{ color: '#3b82f6', textDecoration: 'underline' }}>
            Back to Properties
          </Link>
        </div>
        <Footer />
      </>
    )
  }

  // Property data from the fetched property - only create this AFTER we know property exists
  const propertyData = {
    title: property.title,
    location: property.location,
    price: property.price,
    period: property.period,
    badge: property.badge,
    badge_class: property.badge_class,
    description: property.description,
    longDescription: property.description + ' This property offers excellent value and is located in a prime area with great connectivity.',
    specs: [
      { icon: 'bed-outline', value: property.bedrooms?.toString() || '0', label: 'Bedrooms' },
      { icon: 'man-outline', value: property.bathrooms?.toString() || '0', label: 'Bathrooms' },
      { icon: 'home-outline', value: property.area || '0', label: property.area_unit || 'Sq. Ft.' }
    ],
    amenities: [
      '24/7 Security', 'Power Backup', 'Water Supply', 'Internet Ready',
      'CCTV Surveillance', 'Elevator', 'Garden Area', 'Children\'s Play Area'
    ],
    highlights: [
      'Prime Location', 'Modern Construction', 'Fully Furnished',
      'Ready to Move', 'Excellent Connectivity', 'Family Friendly'
    ],
    locationInfo: [
      'Metro Station: 0.5 km', 'Market: 0.3 km', 'Hospital: 1.2 km',
      'School: 0.8 km', 'Airport: 15 km', 'Railway Station: 8 km'
    ]
  }

  return (
    <>
      <Header />
      
      <main>

        <section className="property-hero">
          <div className="container">
            <div className="property-hero-content">
              <div className="property-hero-text">
                <h1 className="h1">{propertyData.title}</h1>
                <p className="property-location">
                  <IoLocationOutline />
                  {propertyData.location}
                </p>
                <div className="property-price">
                  <strong>{propertyData.price}</strong>{propertyData.period}
                </div>
                <div className={`property-badge ${propertyData.badge_class}`}>{propertyData.badge}</div>
              </div>
              
              <div className="property-hero-image">
                <Image 
                  src={property.image}
                  alt={propertyData.title} 
                  className="w-100"
                  width={600}
                  height={400}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="property-details">
          <div className="container">
            <div className="property-details-grid">
              <div className="property-main-details">
                <h2 className="h2">Property Details</h2>
                
                <div className="property-specs">
                  {propertyData.specs.map((spec, index) => (
                    <div key={index} className="spec-item">
                      <IoBedOutline />
                      <div>
                        <strong>{spec.value}</strong>
                        <span>{spec.label}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="property-description">
                  <h3 className="h3">Description</h3>
                  <p>{propertyData.description}</p>
                  <p>{propertyData.longDescription}</p>
                </div>

                <div className="property-amenities">
                  <h3 className="h3">Amenities</h3>
                  <ul className="amenities-list">
                    {propertyData.amenities.map((amenity, index) => (
                      <li key={index}>
                        <IoCheckmarkCircleOutline /> {amenity}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>


              <div className="property-sidebar">
                <div className="contact-card">
                  <h3 className="h3">Contact Agent</h3>
                  <div className="agent-info">
                    <div>
                      <h4>Tony Properties</h4>
                      <p>Dealer | Builder | Collaborator</p>
                      <p className="agent-phone">+91 9811008968</p>
                      <p className="agent-email">tonyproperties1958@gmail.com</p>
                      <p className="agent-address">A2/15, Near Plazzo Inn, Janakpuri, Delhi</p>
                    </div>
                  </div>
                  <a href="https://wa.me/919811008968" target="_blank" rel="noopener noreferrer" className="btn contact-btn">Contact Now</a>
                </div>

                <div className="property-highlights">
                  <h3 className="h3">Property Highlights</h3>
                  <ul>
                    {propertyData.highlights.map((highlight, index) => (
                      <li key={index}>{highlight}</li>
                    ))}
                  </ul>
                </div>

                <div className="property-location-info">
                  <h3 className="h3">Location Highlights</h3>
                  <ul>
                    {propertyData.locationInfo.map((info, index) => (
                      <li key={index}>{info}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>


        <section className="property-gallery">
          <div className="container">
            <h2 className="h2">Property Gallery</h2>
            <div className="gallery-grid">
              {property.images && property.images.length > 0 ? (
                // Display actual uploaded images
                property.images.length === 1 ? (
                  // If only one image, repeat it 4 times for gallery effect
                  Array.from({ length: 4 }, (_, index) => (
                    <div key={index} className="gallery-item" onClick={() => {
                      setSelectedImageIndex(0)
                      setShowGalleryModal(true)
                    }}>
                      <Image 
                        src={property.images[0].url} 
                        alt={`${propertyData.title} - View ${index + 1}`} 
                        className="w-100"
                        width={300}
                        height={200}
                      />
                      <span>{index === 0 ? 'Main View' : `View ${index + 1}`}</span>
                    </div>
                  ))
                ) : property.images.length <= 4 ? (
                  // Display all available images (2-4 images)
                  property.images.map((image, index) => (
                    <div key={index} className="gallery-item" onClick={() => {
                      setSelectedImageIndex(index)
                      setShowGalleryModal(true)
                    }}>
                      <Image 
                        src={image.url} 
                        alt={`${propertyData.title} - ${image.isPrimary ? 'Main View' : `View ${index + 1}`}`} 
                        className="w-100"
                        width={300}
                        height={200}
                      />
                      <span>{image.isPrimary ? 'Main View' : `View ${index + 1}`}</span>
                    </div>
                  ))
                ) : (
                  // Display first 4 images with "View All" option
                  <>
                    {property.images.slice(0, 4).map((image, index) => (
                      <div key={index} className="gallery-item" onClick={() => {
                        setSelectedImageIndex(index)
                        setShowGalleryModal(true)
                      }}>
                        <Image 
                          src={image.url} 
                          alt={`${propertyData.title} - ${image.isPrimary ? 'Main View' : `View ${index + 1}`}`} 
                          className="w-100"
                          width={300}
                          height={200}
                        />
                        <span>{image.isPrimary ? 'Main View' : `View ${index + 1}`}</span>
                      </div>
                    ))}
                    <div className="gallery-item view-all-item" onClick={() => setShowGalleryModal(true)}>
                      <div className="view-all-overlay">
                        <div className="view-all-content">
                          <span className="view-all-text">View All</span>
                          <span className="image-count">+{property.images.length - 4} more</span>
                        </div>
                      </div>
                      <Image 
                        src={property.images[4].url} 
                        alt={`${propertyData.title} - View 5`} 
                        className="w-100"
                        width={300}
                        height={200}
                      />
                      <span>View All ({property.images.length} photos)</span>
                    </div>
                  </>
                )
              ) : (
                // Fallback to static images if no images are uploaded
                <>
                  <div className="gallery-item">
                    <Image 
                      src={property.image} 
                      alt="Main View" 
                      className="w-100"
                      width={300}
                      height={200}
                    />
                    <span>Main View</span>
                  </div>
                  <div className="gallery-item">
                    <Image 
                      src="/images/kitchen-1940174_1280.jpg" 
                      alt="Kitchen" 
                      className="w-100"
                      width={300}
                      height={200}
                    />
                    <span>Kitchen</span>
                  </div>
                  <div className="gallery-item">
                    <Image 
                      src="/images/kitchen-7850352_1280.jpg" 
                      alt="Modern Kitchen" 
                      className="w-100"
                      width={300}
                      height={200}
                    />
                    <span>Modern Kitchen</span>
                  </div>
                  <div className="gallery-item">
                    <Image 
                      src={property.image} 
                      alt="Additional View" 
                      className="w-100"
                      width={300}
                      height={200}
                    />
                    <span>Additional View</span>
                  </div>
                </>
              )}
            </div>
            
            {/* Show total image count if more than 4 images */}
            {property.images && property.images.length > 4 && (
              <div className="gallery-info">
                <p className="gallery-count">
                  Total Photos: {property.images.length} • Showing first 4 photos
                </p>
              </div>
            )}
          </div>
        </section>


        <section className="similar-properties">
          <div className="container">
            <h2 className="h2">Similar Properties</h2>
            <div className="similar-properties-grid">
              {['3bhk', 'apartments', 'floor', 'apartment'].filter(s => s !== slug).map((similarSlug) => {
                // For now, show static similar properties until we implement proper similar property fetching
                const similarData = {
                  title: similarSlug === '3bhk' ? '3BHK Apartment' : 
                         similarSlug === 'apartments' ? 'Modern Apartments' : 
                         similarSlug === 'floor' ? 'Elegant Floor' : 'Cozy Apartment',
                  price: similarSlug === '3bhk' ? '₹34,900' : 
                         similarSlug === 'apartments' ? '₹35,90,000' : 
                         similarSlug === 'floor' ? '₹50,000' : '₹34,000',
                  period: similarSlug === 'apartments' ? '' : '/Month'
                }
                
                return (
                  <div key={similarSlug} className="similar-property-card">
                    <Image 
                      src={`/images/property-${similarSlug === '3bhk' ? '1' : similarSlug === 'apartments' ? '2' : similarSlug === 'floor' ? '3' : '4'}.jpg`} 
                      alt={similarData.title} 
                      className="w-100"
                      width={300}
                      height={200}
                    />
                    <div className="similar-property-content">
                      <h3>{similarData.title}</h3>
                      <p>{similarData.price}{similarData.period}</p>
                      <Link href={`/properties/${similarSlug}`} className="btn">View Details</Link>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      </main>

      {/* Gallery Modal */}
      {showGalleryModal && property.images && property.images.length > 0 && (
        <div className="gallery-modal-overlay" onClick={() => setShowGalleryModal(false)}>
          <div className="gallery-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="gallery-modal-header">
              <h3>{propertyData.title} - Photo Gallery</h3>
              <button 
                className="gallery-modal-close"
                onClick={() => setShowGalleryModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className="gallery-modal-main">
              <button 
                className="gallery-nav-btn gallery-nav-prev"
                onClick={() => setSelectedImageIndex(prev => 
                  prev === 0 ? property.images.length - 1 : prev - 1
                )}
              >
                ‹
              </button>
              
              <div className="gallery-modal-image">
                <Image 
                  src={property.images[selectedImageIndex].url}
                  alt={`${propertyData.title} - Photo ${selectedImageIndex + 1}`}
                  width={800}
                  height={600}
                  className="gallery-modal-img"
                />
                <div className="gallery-image-info">
                  <span>Photo {selectedImageIndex + 1} of {property.images.length}</span>
                  {property.images[selectedImageIndex].isPrimary && (
                    <span className="primary-badge">Primary Photo</span>
                  )}
                </div>
              </div>
              
              <button 
                className="gallery-nav-btn gallery-nav-next"
                onClick={() => setSelectedImageIndex(prev => 
                  prev === property.images.length - 1 ? 0 : prev + 1
                )}
              >
                ›
              </button>
            </div>
            
            <div className="gallery-modal-thumbnails">
              {property.images.map((image, index) => (
                <div 
                  key={index} 
                  className={`gallery-thumbnail ${index === selectedImageIndex ? 'active' : ''}`}
                  onClick={() => setSelectedImageIndex(index)}
                >
                  <Image 
                    src={image.url}
                    alt={`${propertyData.title} - Thumbnail ${index + 1}`}
                    width={80}
                    height={60}
                    className="thumbnail-img"
                  />
                  {image.isPrimary && <span className="primary-indicator">★</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  )
}
