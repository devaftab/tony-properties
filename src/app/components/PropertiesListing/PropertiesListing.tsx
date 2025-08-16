'use client'
import { useState, useMemo, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { IoLocationOutline, IoCameraOutline, IoFilmOutline, IoBedOutline, IoManOutline, IoHomeOutline, IoArrowForwardOutline, IoChevronBackOutline, IoChevronForwardOutline } from '../icons'
import styles from './PropertiesListing.module.css'
import { supabase } from '@/lib/supabase'

const ITEMS_PER_PAGE = 6

export default function PropertiesListing() {
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [properties, setProperties] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Filter properties based on selection
  const filteredProperties = useMemo(() => {
    if (selectedFilter === 'all') return properties
    if (selectedFilter === 'rent') return properties.filter(p => p.period === '/Month')
    if (selectedFilter === 'sale') return properties.filter(p => p.period === '')
    return properties
  }, [selectedFilter, properties])

  // Calculate pagination
  const totalPages = Math.ceil(filteredProperties.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentProperties = filteredProperties.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  // Fetch properties from Supabase when component mounts
  useEffect(() => {
    fetchProperties()
  }, [])

  // Handle scrolling to top when page changes
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [currentPage])

  // Function to fetch properties from Supabase
  const fetchProperties = async () => {
    try {
      setLoading(true)
      
      // Get all properties
      const { data: propertiesData, error: propertiesError } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false })

      if (propertiesError) {
        console.error('Error fetching properties:', error)
        return
      }

      // Get all property images
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
      console.log(`✅ Loaded ${transformedProperties.length} properties from Supabase for public page`)
    } catch (error) {
      console.error('Error fetching properties:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (filter: string) => {
    setSelectedFilter(filter)
    setCurrentPage(1) // Reset to first page when filter changes
  }

  return (
    <section className={styles.propertiesListing}>
      <div className="container">
        <div className={styles.listingHeader}>
          <h1 className="h1">All Properties</h1>
        </div>

        {/* Filters */}
        <div className={styles.filters}>
          <button 
            className={`${styles.filterBtn} ${selectedFilter === 'all' ? styles.active : ''}`}
            onClick={() => handleFilterChange('all')}
          >
            All Properties ({properties.length})
          </button>
          <button 
            className={`${styles.filterBtn} ${selectedFilter === 'rent' ? styles.active : ''}`}
            onClick={() => handleFilterChange('rent')}
          >
            For Rent ({properties.filter(p => p.period === '/Month').length})
          </button>
          <button 
            className={`${styles.filterBtn} ${selectedFilter === 'sale' ? styles.active : ''}`}
            onClick={() => handleFilterChange('sale')}
          >
            For Sale ({properties.filter(p => p.period === '').length})
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className={styles.loading}>
            <p>Loading properties...</p>
          </div>
        )}

        {/* No Properties State */}
        {!loading && properties.length === 0 && (
          <div className={styles.noProperties}>
            <p>No properties found.</p>
          </div>
        )}

        {/* Properties Grid */}
        {!loading && properties.length > 0 && (
          <div className={styles.propertiesGrid}>
            {currentProperties.map((property) => (
            <div key={property.id} className={styles.propertyCard}>
              <figure className={styles.cardBanner}>
                <Link href={`/properties/${property.slug}`}>
                  <Image 
                    src={property.image} 
                    alt={property.title} 
                    className="w-100"
                    width={400}
                    height={300}
                  />
                </Link>

                <div className={`${styles.cardBadge} ${styles[property.badgeClass]}`}>{property.badge}</div>

                <div className={styles.bannerActions}>
                  <button className={styles.bannerActionsBtn}>
                    <IoLocationOutline />
                    <address>{property.location}</address>
                  </button>

                  <button className={styles.bannerActionsBtn}>
                    <IoCameraOutline />
                    <span>4</span>
                  </button>

                  <button className={styles.bannerActionsBtn}>
                    <IoFilmOutline />
                    <span>2</span>
                  </button>
                </div>
              </figure>

              <div className={styles.cardContent}>
                <div className={styles.cardPrice}>
                  <strong>{property.price}</strong>{property.period}
                </div>

                <h3 className="h3 card-title">
                  <Link href={`/properties/${property.slug}`}>{property.title}</Link>
                </h3>

                <p className={styles.cardText}>{property.description}</p>

                <ul className={styles.cardList}>
                  <li className={styles.cardItem}>
                    <strong>{property.bedrooms}</strong>
                    <IoBedOutline />
                    <span>Bedrooms</span>
                  </li>

                  <li className={styles.cardItem}>
                    <strong>{property.bathrooms}</strong>
                    <IoManOutline />
                    <span>Bathrooms</span>
                  </li>

                  <li className={styles.cardItem}>
                    <strong>{property.area}</strong>
                    <IoHomeOutline />
                    <span>{property.areaUnit}</span>
                  </li>
                </ul>

                <Link href={`/properties/${property.slug}`} className={`btn ${styles.exploreBtn}`}>
                  <span>Explore Property</span>
                  <IoArrowForwardOutline />
                </Link>
              </div>
            </div>
          ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className={styles.pagination}>
            <button 
              className={`${styles.paginationBtn} ${currentPage === 1 ? styles.disabled : ''}`}
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <IoChevronBackOutline />
              Previous
            </button>

            <div className={styles.pageNumbers}>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  className={`${styles.pageNumber} ${currentPage === page ? styles.active : ''}`}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </button>
              ))}
            </div>

            <button 
              className={`${styles.paginationBtn} ${currentPage === totalPages ? styles.disabled : ''}`}
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
              <IoChevronForwardOutline />
            </button>
          </div>
        )}

        {/* Results Info */}
        <div className={styles.resultsInfo}>
          <p>
            Showing {startIndex + 1}-{Math.min(endIndex, filteredProperties.length)} of {filteredProperties.length} properties
          </p>
        </div>
      </div>
    </section>
  )
}
