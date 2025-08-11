import Image from 'next/image'
import Link from 'next/link'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { IoLocationOutline, IoBedOutline, IoHomeOutline, IoCheckmarkCircleOutline } from 'react-icons/io5'

interface PropertyPageProps {
  params: {
    slug: string
  }
}

export default function PropertyPage({ params }: PropertyPageProps) {
  const { slug } = params

  // Property data based on slug
  const getPropertyData = (slug: string) => {
    switch (slug) {
      case '3bhk':
        return {
          title: '3BHK Luxury Apartment',
          location: 'B2 Janakpuri, New Delhi',
          price: '₹34,900',
          period: '/Month',
          badge: 'For Rent',
          badgeClass: 'green',
          description: 'This beautiful 3BHK apartment offers the perfect blend of comfort and luxury. Located in the heart of Janakpuri, this property features modern amenities, spacious rooms, and excellent connectivity to major landmarks. The apartment is fully furnished and ready for immediate occupancy.',
          longDescription: 'The property boasts of high-quality construction, modern fixtures, and a well-maintained environment. Perfect for families looking for a comfortable living space in a prime location.',
          specs: [
            { icon: 'bed-outline', value: '3', label: 'Bedrooms' },
            { icon: 'man-outline', value: '2', label: 'Bathrooms' },
            { icon: 'home-outline', value: '350', label: 'Square Yards' }
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
      case 'apartments':
        return {
          title: 'Modern Apartments',
          location: 'A2/15 Janakpuri',
          price: '₹35,90,000',
          period: '',
          badge: 'For Sales',
          badgeClass: 'orange',
          description: 'Modern apartment complex offering premium living spaces with contemporary design. Each unit features high-quality finishes, smart home technology, and access to community amenities including a gym, swimming pool, and landscaped gardens.',
          longDescription: 'These apartments are designed for modern living with attention to detail and quality craftsmanship.',
          specs: [
            { icon: 'bed-outline', value: '3', label: 'Bedrooms' },
            { icon: 'man-outline', value: '2', label: 'Bathrooms' },
            { icon: 'home-outline', value: '3450', label: 'Square Ft' }
          ],
          amenities: [
            'Gym', 'Swimming Pool', 'Landscaped Gardens', 'Smart Home Technology',
            'High-Quality Finishes', 'Community Amenities', 'Security System'
          ],
          highlights: [
            'Premium Location', 'Contemporary Design', 'Smart Technology',
            'Community Living', 'High-End Finishes', 'Investment Opportunity'
          ],
          locationInfo: [
            'Metro Station: 0.8 km', 'Market: 0.5 km', 'Hospital: 1.5 km',
            'School: 1.0 km', 'Airport: 16 km', 'Railway Station: 9 km'
          ]
        }
      case 'floor':
        return {
          title: 'Elegant Floor Apartment',
          location: 'A1/27 Uttam Nagar',
          price: '₹50,000',
          period: '/Month',
          badge: 'For Rent',
          badgeClass: 'green',
          description: 'Elegant floor apartment with premium finishes and thoughtful design. Features include an open-concept living area, designer kitchen with modern appliances, and large windows that flood the space with natural light.',
          longDescription: 'This property offers a sophisticated living experience with attention to detail and modern conveniences.',
          specs: [
            { icon: 'bed-outline', value: '3', label: 'Bedrooms' },
            { icon: 'man-outline', value: '2', label: 'Bathrooms' },
            { icon: 'home-outline', value: '3450', label: 'Square Ft' }
          ],
          amenities: [
            'Open-Concept Living', 'Designer Kitchen', 'Modern Appliances',
            'Large Windows', 'Natural Light', 'Premium Finishes', 'Balcony'
          ],
          highlights: [
            'Sophisticated Design', 'Premium Finishes', 'Natural Lighting',
            'Modern Appliances', 'Open Layout', 'Balcony Views'
          ],
          locationInfo: [
            'Metro Station: 1.2 km', 'Market: 0.7 km', 'Hospital: 1.8 km',
            'School: 1.2 km', 'Airport: 18 km', 'Railway Station: 10 km'
          ]
        }
      case 'apartment':
        return {
          title: 'Cozy Apartment',
          location: 'B2 Janakpuri',
          price: '₹34,000',
          period: '/Month',
          badge: 'For Rent',
          badgeClass: 'green',
          description: 'Cozy apartment with a warm, inviting atmosphere and practical layout. Includes a functional kitchen, comfortable living space, and a private balcony perfect for morning coffee or evening relaxation.',
          longDescription: 'This apartment provides a comfortable and practical living space with all essential amenities.',
          specs: [
            { icon: 'bed-outline', value: '3', label: 'Bedrooms' },
            { icon: 'man-outline', value: '2', label: 'Bathrooms' },
            { icon: 'home-outline', value: '3450', label: 'Square Ft' }
          ],
          amenities: [
            'Functional Kitchen', 'Comfortable Living Space', 'Private Balcony',
            'Warm Atmosphere', 'Practical Layout', 'Essential Amenities'
          ],
          highlights: [
            'Cozy Atmosphere', 'Practical Design', 'Private Balcony',
            'Functional Layout', 'Warm Environment', 'Comfortable Living'
          ],
          locationInfo: [
            'Metro Station: 0.6 km', 'Market: 0.4 km', 'Hospital: 1.3 km',
            'School: 0.9 km', 'Airport: 15.5 km', 'Railway Station: 8.5 km'
          ]
        }
      default:
        return null
    }
  }

  const propertyData = getPropertyData(slug)

  if (!propertyData) {
    return (
      <>
        <Header />
        <div className="container" style={{ padding: '100px 15px', textAlign: 'center' }}>
          <h1>Property Not Found</h1>
          <p>The property you're looking for doesn't exist.</p>
          <Link href="/" className="btn">Back to Home</Link>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      
      <main>
        {/* Property Hero Section */}
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
                  src={`/images/property-${slug === '3bhk' ? '1' : slug === 'apartments' ? '2' : slug === 'floor' ? '3' : '4'}.jpg`} 
                  alt={propertyData.title} 
                  className="w-100"
                  width={600}
                  height={400}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Property Details Section */}
        <section className="property-details">
          <div className="container">
            <div className="property-details-grid">
              {/* Main Details */}
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

              {/* Sidebar */}
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

        {/* Additional Images Section */}
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

        {/* Similar Properties Section */}
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
