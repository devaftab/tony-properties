'use client'
import { useState, useMemo, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { IoLocationOutline, IoCameraOutline, IoFilmOutline, IoBedOutline, IoManOutline, IoHomeOutline, IoArrowForwardOutline, IoChevronBackOutline, IoChevronForwardOutline } from '../icons'
import styles from './PropertiesListing.module.css'

// Mock data for all properties (in a real app, this would come from an API)
const allProperties = [
  {
    id: 1,
    title: '3BHK Apartment',
    location: 'B2 Janakpuri',
    price: '₹34,900',
    period: '/Month',
    badge: 'For Rent',
    badgeClass: 'green',
    image: '/images/property-1.jpg',
    description: 'Spacious 3BHK apartment with modern amenities, located in a prime residential area.',
    bedrooms: 3,
    bathrooms: 2,
    area: '350',
    areaUnit: 'Square yards',
    slug: '3bhk'
  },
  {
    id: 2,
    title: 'Modern Apartments',
    location: 'A2/15 Janakpuri',
    price: '₹35,90,000',
    period: '',
    badge: 'For Sales',
    badgeClass: 'orange',
    image: '/images/property-2.jpg',
    description: 'Modern apartment complex offering premium living spaces with contemporary design.',
    bedrooms: 3,
    bathrooms: 2,
    area: '3450',
    areaUnit: 'Square Ft',
    slug: 'apartments'
  },
  {
    id: 3,
    title: 'Elegant Floor',
    location: 'A1/27 Uttam Nagar',
    price: '₹50,000',
    period: '/Month',
    badge: 'For Rent',
    badgeClass: 'green',
    image: '/images/property-3.jpg',
    description: 'Elegant floor apartment with premium finishes and thoughtful design.',
    bedrooms: 3,
    bathrooms: 2,
    area: '3450',
    areaUnit: 'Square Ft',
    slug: 'floor'
  },
  {
    id: 4,
    title: 'Cozy Apartment',
    location: 'B2 Janakpuri',
    price: '₹34,000',
    period: '/Month',
    badge: 'For Rent',
    badgeClass: 'green',
    image: '/images/property-4.png',
    description: 'Cozy apartment with a warm, inviting atmosphere and practical layout.',
    bedrooms: 3,
    bathrooms: 2,
    area: '3450',
    areaUnit: 'Square Ft',
    slug: 'apartment'
  },
  {
    id: 5,
    title: 'Luxury Villa',
    location: 'C1/45 Dwarka',
    price: '₹85,000',
    period: '/Month',
    badge: 'For Rent',
    badgeClass: 'green',
    image: '/images/property-1.jpg',
    description: 'Luxury villa with premium amenities and spacious interiors.',
    bedrooms: 4,
    bathrooms: 3,
    area: '5000',
    areaUnit: 'Square Ft',
    slug: 'luxury-villa'
  },
  {
    id: 6,
    title: 'Studio Apartment',
    location: 'D3/12 Rohini',
    price: '₹25,000',
    period: '/Month',
    badge: 'For Rent',
    badgeClass: 'green',
    image: '/images/property-2.jpg',
    description: 'Compact studio apartment perfect for singles or couples.',
    bedrooms: 1,
    bathrooms: 1,
    area: '800',
    areaUnit: 'Square Ft',
    slug: 'studio'
  },
  {
    id: 7,
    title: 'Penthouse Suite',
    location: 'E1/78 Vasant Vihar',
    price: '₹1,25,000',
    period: '/Month',
    badge: 'For Rent',
    badgeClass: 'green',
    image: '/images/property-3.jpg',
    description: 'Exclusive penthouse with panoramic city views and luxury finishes.',
    bedrooms: 5,
    bathrooms: 4,
    area: '8000',
    areaUnit: 'Square Ft',
    slug: 'penthouse'
  },
  {
    id: 8,
    title: 'Townhouse',
    location: 'F2/34 Greater Noida',
    price: '₹75,00,000',
    period: '',
    badge: 'For Sales',
    badgeClass: 'orange',
    image: '/images/property-4.png',
    description: 'Beautiful townhouse with garden and modern amenities.',
    bedrooms: 4,
    bathrooms: 3,
    area: '4200',
    areaUnit: 'Square Ft',
    slug: 'townhouse'
  },
  {
    id: 9,
    title: 'Modern Duplex',
    location: 'G1/56 Noida',
    price: '₹95,000',
    period: '/Month',
    badge: 'For Rent',
    badgeClass: 'green',
    image: '/images/property-1.jpg',
    description: 'Spacious duplex with modern amenities and private garden.',
    bedrooms: 5,
    bathrooms: 4,
    area: '6000',
    areaUnit: 'Square Ft',
    slug: 'modern-duplex'
  },
  {
    id: 10,
    title: 'Luxury Penthouse',
    location: 'H2/78 Gurgaon',
    price: '₹2,50,00,000',
    period: '',
    badge: 'For Sales',
    badgeClass: 'orange',
    image: '/images/property-2.jpg',
    description: 'Ultra-luxury penthouse with panoramic city views.',
    bedrooms: 6,
    bathrooms: 5,
    area: '12000',
    areaUnit: 'Square Ft',
    slug: 'luxury-penthouse'
  }
]

const ITEMS_PER_PAGE = 6

export default function PropertiesListing() {
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedFilter, setSelectedFilter] = useState('all')

  // Filter properties based on selection
  const filteredProperties = useMemo(() => {
    if (selectedFilter === 'all') return allProperties
    if (selectedFilter === 'rent') return allProperties.filter(p => p.period === '/Month')
    if (selectedFilter === 'sale') return allProperties.filter(p => p.period === '')
    return allProperties
  }, [selectedFilter])

  // Calculate pagination
  const totalPages = Math.ceil(filteredProperties.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentProperties = filteredProperties.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  // Handle scrolling to top when page changes
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [currentPage])

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
            All Properties ({allProperties.length})
          </button>
          <button 
            className={`${styles.filterBtn} ${selectedFilter === 'rent' ? styles.active : ''}`}
            onClick={() => handleFilterChange('rent')}
          >
            For Rent ({allProperties.filter(p => p.period === '/Month').length})
          </button>
          <button 
            className={`${styles.filterBtn} ${selectedFilter === 'sale' ? styles.active : ''}`}
            onClick={() => handleFilterChange('sale')}
          >
            For Sale ({allProperties.filter(p => p.period === '').length})
          </button>
        </div>

        {/* Properties Grid */}
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
