const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables!')
  console.error('Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your .env.local file')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Your current properties data (copy from src/app/data/properties.ts)
const currentProperties = [
  {
    title: '3BHK Apartment',
    location: 'B2 Janakpuri',
    price: 34900,
    period: '/Month',
    badge: 'For Rent',
    badge_class: 'green',
    description: 'Spacious 3BHK apartment with modern amenities, located in a prime residential area.',
    bedrooms: 3,
    bathrooms: 2,
    area: 350,
    area_unit: 'Square yards',
    slug: '3bhk',
    property_type: 'Apartment',
    parking: 2,
    year_built: 2020
  },
  {
    title: 'Modern Apartments',
    location: 'A2/15 Janakpuri',
    price: 3590000,
    period: '',
    badge: 'For Sales',
    badge_class: 'orange',
    description: 'Modern apartment complex offering premium living spaces with contemporary design.',
    bedrooms: 3,
    bathrooms: 2,
    area: 3450,
    area_unit: 'Square Ft',
    slug: 'apartments',
    property_type: 'Apartment',
    parking: 1,
    year_built: 2021
  },
  {
    title: 'Elegant Floor',
    location: 'A1/27 Uttam Nagar',
    price: 50000,
    period: '/Month',
    badge: 'For Rent',
    badge_class: 'green',
    description: 'Elegant floor apartment with premium finishes and thoughtful design.',
    bedrooms: 3,
    bathrooms: 2,
    area: 3450,
    area_unit: 'Square Ft',
    slug: 'floor',
    property_type: 'Floor',
    parking: 2,
    year_built: 2019
  },
  {
    title: 'Cozy Apartment',
    location: 'B2 Janakpuri',
    price: 34000,
    period: '/Month',
    badge: 'For Rent',
    badge_class: 'green',
    description: 'Cozy apartment with a warm, inviting atmosphere and practical layout.',
    bedrooms: 3,
    bathrooms: 2,
    area: 3450,
    area_unit: 'Square Ft',
    slug: 'apartment',
    property_type: 'Apartment',
    parking: 1,
    year_built: 2022
  },
  {
    title: 'Luxury Villa',
    location: 'C1/45 Dwarka',
    price: 85000,
    period: '/Month',
    badge: 'For Rent',
    badge_class: 'green',
    description: 'Luxury villa with premium amenities and spacious interiors.',
    bedrooms: 4,
    bathrooms: 3,
    area: 5000,
    area_unit: 'Square Ft',
    slug: 'luxury-villa',
    property_type: 'Villa',
    parking: 3,
    year_built: 2020
  },
  {
    title: 'Studio Apartment',
    location: 'D3/12 Rohini',
    price: 25000,
    period: '/Month',
    badge: 'For Rent',
    badge_class: 'green',
    description: 'Compact studio apartment perfect for singles or couples.',
    bedrooms: 1,
    bathrooms: 1,
    area: 800,
    area_unit: 'Square Ft',
    slug: 'studio',
    property_type: 'Studio',
    parking: 1,
    year_built: 2021
  },
  {
    title: 'Penthouse Suite',
    location: 'E1/78 Vasant Vihar',
    price: 125000,
    period: '/Month',
    badge: 'For Rent',
    badge_class: 'green',
    description: 'Exclusive penthouse with panoramic city views and luxury finishes.',
    bedrooms: 5,
    bathrooms: 4,
    area: 8000,
    area_unit: 'Square Ft',
    slug: 'penthouse',
    property_type: 'Penthouse',
    parking: 2,
    year_built: 2020
  },
  {
    title: 'Townhouse',
    location: 'F2/34 Greater Noida',
    price: 7500000,
    period: '',
    badge: 'For Sales',
    badge_class: 'orange',
    description: 'Beautiful townhouse with garden and modern amenities.',
    bedrooms: 4,
    bathrooms: 3,
    area: 4200,
    area_unit: 'Square Ft',
    slug: 'townhouse',
    property_type: 'Townhouse',
    parking: 2,
    year_built: 2019
  },
  {
    title: 'Modern Duplex',
    location: 'G1/56 Noida',
    price: 95000,
    period: '/Month',
    badge: 'For Rent',
    badge_class: 'green',
    description: 'Spacious duplex with modern amenities and private garden.',
    bedrooms: 5,
    bathrooms: 4,
    area: 6000,
    area_unit: 'Square Ft',
    slug: 'modern-duplex',
    property_type: 'Duplex',
    parking: 3,
    year_built: 2021
  },
  {
    title: 'Luxury Penthouse',
    location: 'H2/78 Gurgaon',
    price: 25000000,
    period: '',
    badge: 'For Sales',
    badge_class: 'orange',
    description: 'Ultra-luxury penthouse with panoramic city views.',
    bedrooms: 6,
    bathrooms: 5,
    area: 12000,
    area_unit: 'Square Ft',
    slug: 'luxury-penthouse',
    property_type: 'Penthouse',
    parking: 4,
    year_built: 2022
  }
]

// Property images mapping (from your Cloudinary uploads)
const propertyImages = {
  '3bhk': [
    {
      url: 'https://res.cloudinary.com/tony-properties/image/upload/v1755330917/tony-properties/property-1.jpg',
      thumbnail_url: 'https://res.cloudinary.com/tony-properties/image/upload/c_thumb,w_150,h_150,q_80/v1755330917/tony-properties/property-1.jpg',
      medium_url: 'https://res.cloudinary.com/tony-properties/image/upload/c_fill,w_400,h_300,q_85/v1755330917/tony-properties/property-1.jpg',
      large_url: 'https://res.cloudinary.com/tony-properties/image/upload/c_fill,w_800,h_600,q_90/v1755330917/tony-properties/property-1.jpg',
      public_id: 'tony-properties/property-1',
      width: 3328,
      height: 4992,
      format: 'jpg',
      size: 4545807,
      is_primary: true
    }
  ],
  'apartments': [
    {
      url: 'https://res.cloudinary.com/tony-properties/image/upload/v1755330919/tony-properties/property-2.jpg',
      thumbnail_url: 'https://res.cloudinary.com/tony-properties/image/upload/c_thumb,w_150,h_150,q_80/v1755330919/tony-properties/property-2.jpg',
      medium_url: 'https://res.cloudinary.com/tony-properties/image/upload/c_fill,w_400,h_300,q_85/v1755330919/tony-properties/property-2.jpg',
      large_url: 'https://res.cloudinary.com/tony-properties/image/upload/c_fill,w_800,h_600,q_90/v1755330919/tony-properties/property-2.jpg',
      public_id: 'tony-properties/property-2',
      width: 850,
      height: 650,
      format: 'jpg',
      size: 68286,
      is_primary: true
    }
  ],
  'floor': [
    {
      url: 'https://res.cloudinary.com/tony-properties/image/upload/v1755330921/tony-properties/property-3.jpg',
      thumbnail_url: 'https://res.cloudinary.com/tony-properties/image/upload/c_thumb,w_150,h_150,q_80/v1755330921/tony-properties/property-3.jpg',
      medium_url: 'https://res.cloudinary.com/tony-properties/image/upload/c_fill,w_400,h_300,q_85/v1755330921/tony-properties/property-3.jpg',
      large_url: 'https://res.cloudinary.com/tony-properties/image/upload/c_fill,w_800,h_600,q_90/v1755330921/tony-properties/property-3.jpg',
      public_id: 'tony-properties/property-3',
      width: 850,
      height: 650,
      format: 'jpg',
      size: 88201,
      is_primary: true
    }
  ],
  'apartment': [
    {
      url: 'https://res.cloudinary.com/tony-properties/image/upload/v1755330923/tony-properties/property-4.png',
      thumbnail_url: 'https://res.cloudinary.com/tony-properties/image/upload/c_thumb,w_150,h_150,q_80/v1755330923/tony-properties/property-4.png',
      medium_url: 'https://res.cloudinary.com/tony-properties/image/upload/c_fill,w_400,h_300,q_85/v1755330923/tony-properties/property-4.png',
      large_url: 'https://res.cloudinary.com/tony-properties/image/upload/c_fill,w_800,h_600,q_90/v1755330923/tony-properties/property-4.png',
      public_id: 'tony-properties/property-4',
      width: 854,
      height: 614,
      format: 'png',
      size: 146591,
      is_primary: true
    }
  ]
}

// Property amenities mapping
const propertyAmenities = {
  '3bhk': ['Balcony', 'Gym', 'Swimming Pool', 'Security', 'Lift'],
  'apartments': ['Balcony', 'Gym', 'Security', 'Lift', 'Parking'],
  'floor': ['Balcony', 'Security', 'Lift', 'Parking'],
  'apartment': ['Balcony', 'Security', 'Lift', 'Parking'],
  'luxury-villa': ['Garden', 'Terrace', 'Air Conditioning', 'Heating', 'Furnished'],
  'studio': ['Air Conditioning', 'Heating', 'Security'],
  'penthouse': ['Terrace', 'Air Conditioning', 'Heating', 'Furnished', 'Pet Friendly'],
  'townhouse': ['Garden', 'Air Conditioning', 'Heating', 'Security'],
  'modern-duplex': ['Garden', 'Terrace', 'Air Conditioning', 'Heating', 'Furnished'],
  'luxury-penthouse': ['Terrace', 'Air Conditioning', 'Heating', 'Furnished', 'Pet Friendly', 'Children Play Area']
}

async function migrateToSupabase() {
  try {
    console.log('🚀 Starting migration to Supabase...\n')

    // Step 1: Insert properties
    console.log('📝 Step 1: Inserting properties...')
    const propertyIds = {}
    
    for (const property of currentProperties) {
      const { data, error } = await supabase
        .from('properties')
        .insert(property)
        .select('id')
        .single()

      if (error) {
        console.error(`❌ Failed to insert property ${property.title}:`, error.message)
        continue
      }

      propertyIds[property.slug] = data.id
      console.log(`✅ Inserted: ${property.title} (ID: ${data.id})`)
    }

    // Step 2: Insert property images
    console.log('\n🖼️  Step 2: Inserting property images...')
    for (const [slug, images] of Object.entries(propertyImages)) {
      const propertyId = propertyIds[slug]
      if (!propertyId) continue

      for (const image of images) {
        const { error } = await supabase
          .from('property_images')
          .insert({
            ...image,
            property_id: propertyId
          })

        if (error) {
          console.error(`❌ Failed to insert image for ${slug}:`, error.message)
        } else {
          console.log(`✅ Inserted image for: ${slug}`)
        }
      }
    }

    // Step 3: Insert property amenities
    console.log('\n🏠 Step 3: Inserting property amenities...')
    for (const [slug, amenities] of Object.entries(propertyAmenities)) {
      const propertyId = propertyIds[slug]
      if (!propertyId) continue

      for (const amenityName of amenities) {
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
            console.error(`❌ Failed to create amenity ${amenityName}:`, error.message)
            continue
          }
          amenity = newAmenity
        }

        // Link property to amenity
        const { error } = await supabase
          .from('property_amenities')
          .insert({
            property_id: propertyId,
            amenity_id: amenity.id
          })

        if (error) {
          console.error(`❌ Failed to link amenity ${amenityName} to ${slug}:`, error.message)
        } else {
          console.log(`✅ Linked amenity: ${amenityName} → ${slug}`)
        }
      }
    }

    console.log('\n🎉 Migration completed successfully!')
    console.log(`📊 Summary:`)
    console.log(`  - Properties: ${Object.keys(propertyIds).length}`)
    console.log(`  - Images: ${Object.values(propertyImages).flat().length}`)
    console.log(`  - Amenities linked: ${Object.values(propertyAmenities).flat().length}`)

  } catch (error) {
    console.error('❌ Migration failed:', error)
  }
}

// Run the migration
if (require.main === module) {
  migrateToSupabase()
}

module.exports = { migrateToSupabase }
