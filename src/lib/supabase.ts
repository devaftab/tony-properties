import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types for TypeScript
export interface Database {
  public: {
    Tables: {
      properties: {
        Row: {
          id: number
          title: string
          slug: string
          description: string
          price: number
          period: string
          badge: string
          badge_class: string
          bedrooms: number
          bathrooms: number
          area: number
          area_unit: string
          property_type: string
          parking: number
          year_built: number
          location: string
          latitude?: number
          longitude?: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          title: string
          slug: string
          description: string
          price: number
          period: string
          badge: string
          badge_class: string
          bedrooms: number
          bathrooms: number
          area: number
          area_unit: string
          property_type: string
          parking: number
          year_built: number
          location: string
          latitude?: number
          longitude?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          title?: string
          slug?: string
          description?: string
          price?: number
          period?: string
          badge?: string
          badge_class?: string
          bedrooms?: number
          bathrooms?: number
          area?: number
          area_unit?: string
          property_type?: string
          parking?: number
          year_built?: number
          location?: string
          latitude?: number
          longitude?: number
          created_at?: string
          updated_at?: string
        }
      }
      property_images: {
        Row: {
          id: number
          property_id: number
          url: string
          thumbnail_url?: string
          medium_url?: string
          large_url?: string
          public_id?: string
          width?: number
          height?: number
          format?: string
          size?: number
          is_primary: boolean
          sort_order: number
        }
        Insert: {
          id?: number
          property_id: number
          url: string
          thumbnail_url?: string
          medium_url?: string
          large_url?: string
          public_id?: string
          width?: number
          height?: number
          format?: string
          size?: number
          is_primary?: boolean
          sort_order?: number
        }
        Update: {
          id?: number
          property_id?: number
          url?: string
          thumbnail_url?: string
          medium_url?: string
          large_url?: string
          public_id?: string
          width?: number
          height?: number
          format?: string
          size?: number
          is_primary?: boolean
          sort_order?: number
        }
      }
      amenities: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
      }
      property_amenities: {
        Row: {
          property_id: number
          amenity_id: number
        }
        Insert: {
          property_id: number
          amenity_id: number
        }
        Update: {
          property_id?: number
          amenity_id?: number
        }
      }
    }
  }
}
