import Image from 'next/image'
import Link from 'next/link'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { IoLocationOutline, IoBedOutline, IoCheckmarkCircleOutline } from 'react-icons/io5'
import { allProperties } from '../../data/properties'

interface PropertyPageProps {
  params: {
    slug: string
  }
}

export default function PropertyPage({ params }: PropertyPageProps) {
  const { slug } = params

  // Find property by slug from the data
  const property = allProperties.find(p => p.slug === slug)

  if (!property) {
    return (
      <>
        <Header />
        <div style={{ padding: '100px 20px', textAlign: 'center' }}>
          <h1>Property Not Found</h1>
          <p>The property you're looking for doesn't exist.</p>
          <Link href="/properties" style={{ color: '#3b82f6', textDecoration: 'underline' }}>
            Back to Properties
          </Link>
        </div>
        <Footer />
      </>
    )
  }

  // Property data from the found property
  const getPropertyData = () => {
    return {
      title: property.title,
      location: property.location,
      price: property.price,
      period: property.period,
      badge: property.badge,
      badgeClass: property.badgeClass,
      description: property.description,
      longDescription: property.description + ' This property offers excellent value and is located in a prime area with great connectivity.',
      specs: [
        { icon: 'bed-outline', value: property.bedrooms.toString(), label: 'Bedrooms' },
        { icon: 'man-outline', value: property.bathrooms.toString(), label: 'Bathrooms' },
        { icon: 'home-outline', value: property.area, label: property.areaUnit }
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
  }

  const propertyData = getPropertyData()

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
                <div className={`property-badge ${propertyData.badgeClass}`}>{propertyData.badge}</div>
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
              <div className="gallery-item">
                <Image 
                  src={`/images/property-${slug === '3bhk' ? '1' : slug === 'apartments' ? '2' : slug === 'floor' ? '3' : '4'}.jpg`} 
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
                  src={`/images/property-${slug === '3bhk' ? '2' : slug === 'apartments' ? '3' : slug === 'floor' ? '4' : '1'}.jpg`} 
                  alt="Additional View" 
                  className="w-100"
                  width={300}
                  height={200}
                />
                <span>Additional View</span>
              </div>
            </div>
          </div>
        </section>


        <section className="similar-properties">
          <div className="container">
            <h2 className="h2">Similar Properties</h2>
            <div className="similar-properties-grid">
              {['3bhk', 'apartments', 'floor', 'apartment'].filter(s => s !== slug).map((similarSlug, index) => {
                const similarData = getPropertyData(similarSlug)
                if (!similarData) return null
                
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

      <Footer />
    </>
  )
}
