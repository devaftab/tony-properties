-- Tony Properties Database Schema
-- Run this in your Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Properties table
CREATE TABLE properties (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  price DECIMAL(12,2) NOT NULL,
  period VARCHAR(50) NOT NULL, -- '/Month' or empty for sale
  badge VARCHAR(50) NOT NULL, -- 'For Rent' or 'For Sale'
  badge_class VARCHAR(50) NOT NULL, -- 'green' or 'orange'
  
  -- Property details
  bedrooms INTEGER NOT NULL,
  bathrooms INTEGER NOT NULL,
  area DECIMAL(10,2) NOT NULL,
  area_unit VARCHAR(50) NOT NULL,
  property_type VARCHAR(100) NOT NULL,
  parking INTEGER NOT NULL,
  year_built INTEGER NOT NULL,
  
  -- Location
  location VARCHAR(255) NOT NULL,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Search optimization
  search_vector tsvector GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(description, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(location, '')), 'C')
  ) STORED
);

-- Property images table
CREATE TABLE property_images (
  id SERIAL PRIMARY KEY,
  property_id INTEGER REFERENCES properties(id) ON DELETE CASCADE,
  url VARCHAR(500) NOT NULL,
  thumbnail_url VARCHAR(500),
  medium_url VARCHAR(500),
  large_url VARCHAR(500),
  public_id VARCHAR(255),
  width INTEGER,
  height INTEGER,
  format VARCHAR(10),
  size INTEGER,
  is_primary BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Amenities table
CREATE TABLE amenities (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Property amenities junction table
CREATE TABLE property_amenities (
  property_id INTEGER REFERENCES properties(id) ON DELETE CASCADE,
  amenity_id INTEGER REFERENCES amenities(id) ON DELETE CASCADE,
  PRIMARY KEY (property_id, amenity_id)
);

-- Indexes for performance
CREATE INDEX idx_properties_search ON properties USING GIN(search_vector);
CREATE INDEX idx_properties_slug ON properties(slug);
CREATE INDEX idx_properties_price ON properties(price);
CREATE INDEX idx_properties_location ON properties(location);
CREATE INDEX idx_properties_type ON properties(property_type);
CREATE INDEX idx_properties_badge ON properties(badge);
CREATE INDEX idx_property_images_property_id ON property_images(property_id);
CREATE INDEX idx_property_images_primary ON property_images(is_primary);
CREATE INDEX idx_property_amenities_property_id ON property_amenities(property_id);

-- Full-text search function
CREATE OR REPLACE FUNCTION properties_search(search_query TEXT)
RETURNS TABLE(
  id INTEGER,
  title VARCHAR(255),
  slug VARCHAR(255),
  description TEXT,
  price DECIMAL(12,2),
  period VARCHAR(50),
  badge VARCHAR(50),
  badge_class VARCHAR(50),
  bedrooms INTEGER,
  bathrooms INTEGER,
  area DECIMAL(10,2),
  area_unit VARCHAR(50),
  property_type VARCHAR(100),
  parking INTEGER,
  year_built INTEGER,
  location VARCHAR(255),
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE,
  search_rank REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.*,
    ts_rank(p.search_vector, plainto_tsquery('english', search_query)) as search_rank
  FROM properties p
  WHERE p.search_vector @@ plainto_tsquery('english', search_query)
  ORDER BY search_rank DESC;
END;
$$ LANGUAGE plpgsql;

-- Row Level Security (RLS) policies
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE amenities ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_amenities ENABLE ROW LEVEL SECURITY;

-- Public read access for properties
CREATE POLICY "Properties are viewable by everyone" ON properties
  FOR SELECT USING (true);

-- Public read access for property images
CREATE POLICY "Property images are viewable by everyone" ON property_images
  FOR SELECT USING (true);

-- Public read access for amenities
CREATE POLICY "Amenities are viewable by everyone" ON amenities
  FOR SELECT USING (true);

-- Public read access for property amenities
CREATE POLICY "Property amenities are viewable by everyone" ON property_amenities
  FOR SELECT USING (true);

-- Insert some default amenities
INSERT INTO amenities (name) VALUES 
  ('Balcony'),
  ('Gym'),
  ('Swimming Pool'),
  ('Security'),
  ('Lift'),
  ('Parking'),
  ('Garden'),
  ('Terrace'),
  ('Air Conditioning'),
  ('Heating'),
  ('Furnished'),
  ('Pet Friendly'),
  ('Children Play Area'),
  ('Shopping Center'),
  ('Hospital'),
  ('School'),
  ('Metro Station'),
  ('Bus Stop');

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_properties_updated_at
  BEFORE UPDATE ON properties
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Comments for documentation
COMMENT ON TABLE properties IS 'Main properties table containing all property information';
COMMENT ON TABLE property_images IS 'Property images with different sizes and Cloudinary data';
COMMENT ON TABLE amenities IS 'Available amenities that can be assigned to properties';
COMMENT ON TABLE property_amenities IS 'Junction table linking properties to amenities';
COMMENT ON FUNCTION properties_search(TEXT) IS 'Full-text search function for properties';
