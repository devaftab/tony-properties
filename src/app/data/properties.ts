export interface Property {
  id: number
  title: string
  location: string
  price: string
  period: string
  badge: string
  badgeClass: string
  image: string
  images?: PropertyImage[]
  description: string
  bedrooms: number
  bathrooms: number
  area: string
  areaUnit: string
  slug: string
  amenities?: string[]
  propertyType?: string
  parking?: number
  yearBuilt?: number
}

export interface PropertyImage {
  url: string
  thumbnailUrl?: string
  mediumUrl?: string
  largeUrl?: string
  publicId?: string
  width?: number
  height?: number
  format?: string
  size?: number
}

// Function to add new properties
export const addProperty = (newProperty: Omit<Property, 'id'>): Property => {
  const id = Math.max(...allProperties.map(p => p.id)) + 1
  const property: Property = {
    ...newProperty,
    id,
    // Set the main image to the first uploaded image or a default
    image: newProperty.images && newProperty.images.length > 0 
      ? newProperty.images[0].thumbnailUrl || newProperty.images[0].url 
      : '/images/property-1.jpg'
  }
  
  allProperties.push(property)
  
  // Save to localStorage for persistence
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('tony-properties', JSON.stringify(allProperties))
    } catch (error) {
      console.warn('Failed to save to localStorage:', error)
    }
  }
  
  return property
}

// Function to load properties from localStorage
export const loadPropertiesFromStorage = (): Property[] => {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('tony-properties')
      if (stored) {
        const parsed = JSON.parse(stored)
        // Merge with default properties, avoiding duplicates
        const existingIds = new Set(parsed.map((p: Property) => p.id))
        const defaultProps = allProperties.filter(p => !existingIds.has(p.id))
        return [...parsed, ...defaultProps]
      }
    } catch (error) {
      console.warn('Failed to load from localStorage:', error)
    }
  }
  return allProperties
}

export const allProperties: Property[] = [
  {
    id: 1,
    title: '3BHK Apartment',
    location: 'B2 Janakpuri',
    price: '₹34,900',
    period: '/Month',
    badge: 'For Rent',
    badgeClass: 'green',
    image: 'https://res.cloudinary.com/tony-properties/image/upload/v1755330917/tony-properties/property-1.jpg',
    description: 'Spacious 3BHK apartment with modern amenities, located in a prime residential area.',
    bedrooms: 3,
    bathrooms: 2,
    area: '350',
    areaUnit: 'Square yards',
    slug: '3bhk',
    propertyType: 'Apartment',
    parking: 2,
    yearBuilt: 2020,
    amenities: ['Balcony', 'Gym', 'Swimming Pool', 'Security', 'Lift'],
    images: [{"url":"https://res.cloudinary.com/tony-properties/image/upload/v1755330917/tony-properties/property-1.jpg","thumbnailUrl":"https://res.cloudinary.com/tony-properties/image/upload/c_thumb,w_150,h_150,q_80/v1755330917/tony-properties/property-1.jpg","mediumUrl":"https://res.cloudinary.com/tony-properties/image/upload/c_fill,w_400,h_300,q_85/v1755330917/tony-properties/property-1.jpg","largeUrl":"https://res.cloudinary.com/tony-properties/image/upload/c_fill,w_800,h_600,q_90/v1755330917/tony-properties/property-1.jpg","publicId":"tony-properties/property-1","width":3328,"height":4992,"format":"jpg","size":4545807}]
  },
  {
    id: 2,
    title: 'Modern Apartments',
    location: 'A2/15 Janakpuri',
    price: '₹35,90,000',
    period: '',
    badge: 'For Sales',
    badgeClass: 'orange',
    image: 'https://res.cloudinary.com/tony-properties/image/upload/v1755330919/tony-properties/property-2.jpg',
    description: 'Modern apartment complex offering premium living spaces with contemporary design.',
    bedrooms: 3,
    bathrooms: 2,
    area: '3450',
    areaUnit: 'Square Ft',
    slug: 'apartments',
    propertyType: 'Apartment',
    parking: 1,
    yearBuilt: 2021,
    amenities: ['Balcony', 'Gym', 'Security', 'Lift', 'Parking'],
    images: [{"url":"https://res.cloudinary.com/tony-properties/image/upload/v1755330919/tony-properties/property-2.jpg","thumbnailUrl":"https://res.cloudinary.com/tony-properties/image/upload/c_thumb,w_150,h_150,q_80/v1755330919/tony-properties/property-2.jpg","mediumUrl":"https://res.cloudinary.com/tony-properties/image/upload/c_fill,w_400,h_300,q_85/v1755330919/tony-properties/property-2.jpg","largeUrl":"https://res.cloudinary.com/tony-properties/image/upload/c_fill,w_800,h_600,q_90/v1755330919/tony-properties/property-2.jpg","publicId":"tony-properties/property-2","width":850,"height":650,"format":"jpg","size":68286}]
  },
  {
    id: 3,
    title: 'Elegant Floor',
    location: 'A1/27 Uttam Nagar',
    price: '₹50,000',
    period: '/Month',
    badge: 'For Rent',
    badgeClass: 'green',
    image: 'https://res.cloudinary.com/tony-properties/image/upload/v1755330921/tony-properties/property-3.jpg',
    description: 'Elegant floor apartment with premium finishes and thoughtful design.',
    bedrooms: 3,
    bathrooms: 2,
    area: '3450',
    areaUnit: 'Square Ft',
    slug: 'floor',
    propertyType: 'Floor',
    parking: 2,
    yearBuilt: 2019,
    images: [{"url":"https://res.cloudinary.com/tony-properties/image/upload/v1755330921/tony-properties/property-3.jpg","thumbnailUrl":"https://res.cloudinary.com/tony-properties/image/upload/c_thumb,w_150,h_150,q_80/v1755330921/tony-properties/property-3.jpg","mediumUrl":"https://res.cloudinary.com/tony-properties/image/upload/c_fill,w_400,h_300,q_85/v1755330921/tony-properties/property-3.jpg","largeUrl":"https://res.cloudinary.com/tony-properties/image/upload/c_fill,w_800,h_600,q_90/v1755330921/tony-properties/property-3.jpg","publicId":"tony-properties/property-3","width":850,"height":650,"format":"jpg","size":88201}]
  },
  {
    id: 4,
    title: 'Cozy Apartment',
    location: 'B2 Janakpuri',
    price: '₹34,000',
    period: '/Month',
    badge: 'For Rent',
    badgeClass: 'green',
    image: 'https://res.cloudinary.com/tony-properties/image/upload/v1755330923/tony-properties/property-4.png',
    description: 'Cozy apartment with a warm, inviting atmosphere and practical layout.',
    bedrooms: 3,
    bathrooms: 2,
    area: '3450',
    areaUnit: 'Square Ft',
    slug: 'apartment',
    propertyType: 'Apartment',
    parking: 1,
    yearBuilt: 2022,
    images: [{"url":"https://res.cloudinary.com/tony-properties/image/upload/v1755330923/tony-properties/property-4.png","thumbnailUrl":"https://res.cloudinary.com/tony-properties/image/upload/c_thumb,w_150,h_150,q_80/v1755330923/tony-properties/property-4.png","mediumUrl":"https://res.cloudinary.com/tony-properties/image/upload/c_fill,w_400,h_300,q_85/v1755330923/tony-properties/property-4.png","largeUrl":"https://res.cloudinary.com/tony-properties/image/upload/c_fill,w_800,h_600,q_90/v1755330923/tony-properties/property-4.png","publicId":"tony-properties/property-4","width":854,"height":614,"format":"png","size":146591}]
  },
  {
    id: 5,
    title: 'Luxury Villa',
    location: 'C1/45 Dwarka',
    price: '₹85,000',
    period: '/Month',
    badge: 'For Rent',
    badgeClass: 'green',
    image: 'https://res.cloudinary.com/tony-properties/image/upload/v1755330917/tony-properties/property-1.jpg',
    description: 'Luxury villa with premium amenities and spacious interiors.',
    bedrooms: 4,
    bathrooms: 3,
    area: '5000',
    areaUnit: 'Square Ft',
    slug: 'luxury-villa',
    propertyType: 'Villa',
    parking: 3,
    yearBuilt: 2020,
    images: [{"url":"https://res.cloudinary.com/tony-properties/image/upload/v1755330917/tony-properties/property-1.jpg","thumbnailUrl":"https://res.cloudinary.com/tony-properties/image/upload/c_thumb,w_150,h_150,q_80/v1755330917/tony-properties/property-1.jpg","mediumUrl":"https://res.cloudinary.com/tony-properties/image/upload/c_fill,w_400,h_300,q_85/v1755330917/tony-properties/property-1.jpg","largeUrl":"https://res.cloudinary.com/tony-properties/image/upload/c_fill,w_800,h_600,q_90/v1755330917/tony-properties/property-1.jpg","publicId":"tony-properties/property-1","width":3328,"height":4992,"format":"jpg","size":4545807}]
  },
  {
    id: 6,
    title: 'Studio Apartment',
    location: 'D3/12 Rohini',
    price: '₹25,000',
    period: '/Month',
    badge: 'For Rent',
    badgeClass: 'green',
    image: 'https://res.cloudinary.com/tony-properties/image/upload/v1755330919/tony-properties/property-2.jpg',
    description: 'Compact studio apartment perfect for singles or couples.',
    bedrooms: 1,
    bathrooms: 1,
    area: '800',
    areaUnit: 'Square Ft',
    slug: 'studio',
    propertyType: 'Studio',
    parking: 1,
    yearBuilt: 2021,
    images: [{"url":"https://res.cloudinary.com/tony-properties/image/upload/v1755330919/tony-properties/property-2.jpg","thumbnailUrl":"https://res.cloudinary.com/tony-properties/image/upload/c_thumb,w_150,h_150,q_80/v1755330919/tony-properties/property-2.jpg","mediumUrl":"https://res.cloudinary.com/tony-properties/image/upload/c_fill,w_400,h_300,q_85/v1755330919/tony-properties/property-2.jpg","largeUrl":"https://res.cloudinary.com/tony-properties/image/upload/c_fill,w_800,h_600,q_90/v1755330919/tony-properties/property-2.jpg","publicId":"tony-properties/property-2","width":850,"height":650,"format":"jpg","size":68286}]
  },
  {
    id: 7,
    title: 'Penthouse Suite',
    location: 'E1/78 Vasant Vihar',
    price: '₹1,25,000',
    period: '/Month',
    badge: 'For Rent',
    badgeClass: 'green',
    image: 'https://res.cloudinary.com/tony-properties/image/upload/v1755330921/tony-properties/property-3.jpg',
    description: 'Exclusive penthouse with panoramic city views and luxury finishes.',
    bedrooms: 5,
    bathrooms: 4,
    area: '8000',
    areaUnit: 'Square Ft',
    slug: 'penthouse',
    propertyType: 'Penthouse',
    parking: 2,
    yearBuilt: 2020,
    images: [{"url":"https://res.cloudinary.com/tony-properties/image/upload/v1755330921/tony-properties/property-3.jpg","thumbnailUrl":"https://res.cloudinary.com/tony-properties/image/upload/c_thumb,w_150,h_150,q_80/v1755330921/tony-properties/property-3.jpg","mediumUrl":"https://res.cloudinary.com/tony-properties/image/upload/c_fill,w_400,h_300,q_85/v1755330921/tony-properties/property-3.jpg","largeUrl":"https://res.cloudinary.com/tony-properties/image/upload/c_fill,w_800,h_600,q_90/v1755330921/tony-properties/property-3.jpg","publicId":"tony-properties/property-3","width":850,"height":650,"format":"jpg","size":88201}]
  },
  {
    id: 8,
    title: 'Townhouse',
    location: 'F2/34 Greater Noida',
    price: '₹75,00,000',
    period: '',
    badge: 'For Sales',
    badgeClass: 'orange',
    image: 'https://res.cloudinary.com/tony-properties/image/upload/v1755330923/tony-properties/property-4.png',
    description: 'Beautiful townhouse with garden and modern amenities.',
    bedrooms: 4,
    bathrooms: 3,
    area: '4200',
    areaUnit: 'Square Ft',
    slug: 'townhouse',
    propertyType: 'Townhouse',
    parking: 2,
    yearBuilt: 2019,
    images: [{"url":"https://res.cloudinary.com/tony-properties/image/upload/v1755330923/tony-properties/property-4.png","thumbnailUrl":"https://res.cloudinary.com/tony-properties/image/upload/c_thumb,w_150,h_150,q_80/v1755330923/tony-properties/property-4.png","mediumUrl":"https://res.cloudinary.com/tony-properties/image/upload/c_fill,w_400,h_300,q_85/v1755330923/tony-properties/property-4.png","largeUrl":"https://res.cloudinary.com/tony-properties/image/upload/c_fill,w_800,h_600,q_90/v1755330923/tony-properties/property-4.png","publicId":"tony-properties/property-4","width":854,"height":614,"format":"png","size":146591}]
  },
  {
    id: 9,
    title: 'Modern Duplex',
    location: 'G1/56 Noida',
    price: '₹95,000',
    period: '/Month',
    badge: 'For Rent',
    badgeClass: 'green',
    image: 'https://res.cloudinary.com/tony-properties/image/upload/v1755330917/tony-properties/property-1.jpg',
    description: 'Spacious duplex with modern amenities and private garden.',
    bedrooms: 5,
    bathrooms: 4,
    area: '6000',
    areaUnit: 'Square Ft',
    slug: 'modern-duplex',
    propertyType: 'Duplex',
    parking: 3,
    yearBuilt: 2021,
        images: [{"url":"https://res.cloudinary.com/tony-properties/image/upload/v1755330917/tony-properties/property-1.jpg","thumbnailUrl":"https://res.cloudinary.com/tony-properties/image/upload/c_thumb,w_150,h_150,q_80/v1755330917/tony-properties/property-1.jpg","mediumUrl":"https://res.cloudinary.com/tony-properties/image/upload/c_fill,w_400,h_300,q_85/v1755330917/tony-properties/property-1.jpg","largeUrl":"https://res.cloudinary.com/tony-properties/image/upload/c_fill,w_800,h_600,q_90/v1755330917/tony-properties/property-1.jpg","publicId":"tony-properties/property-1","width":3328,"height":4992,"format":"jpg","size":4545807}]
  },
  {
    id: 10,
    title: 'Luxury Penthouse',
    location: 'H2/78 Gurgaon',
    price: '₹2,50,00,000',
    period: '',
    badge: 'For Sales',
    badgeClass: 'orange',
    image: 'https://res.cloudinary.com/tony-properties/image/upload/v1755330919/tony-properties/property-2.jpg',
    description: 'Ultra-luxury penthouse with panoramic city views.',
    bedrooms: 6,
    bathrooms: 5,
    area: '12000',
    areaUnit: 'Square Ft',
    slug: 'luxury-penthouse',
    propertyType: 'Penthouse',
    parking: 4,
    yearBuilt: 2022,
    images: [{"url":"https://res.cloudinary.com/tony-properties/image/upload/v1755330919/tony-properties/property-2.jpg","thumbnailUrl":"https://res.cloudinary.com/tony-properties/image/upload/c_thumb,w_150,h_150,q_80/v1755330919/tony-properties/property-2.jpg","mediumUrl":"https://res.cloudinary.com/tony-properties/image/upload/c_fill,w_400,h_300,q_85/v1755330919/tony-properties/property-2.jpg","largeUrl":"https://res.cloudinary.com/tony-properties/image/upload/c_fill,w_800,h_600,q_90/v1755330919/tony-properties/property-2.jpg","publicId":"tony-properties/property-2","width":850,"height":650,"format":"jpg","size":68286}]
  }
]
