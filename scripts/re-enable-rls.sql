-- Re-enable Row Level Security for all tables
-- Run this in your Supabase SQL Editor after setting up authentication

-- Re-enable RLS for properties table
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- Re-enable RLS for property_images table
ALTER TABLE property_images ENABLE ROW LEVEL SECURITY;

-- Re-enable RLS for property_amenities table
ALTER TABLE property_amenities ENABLE ROW LEVEL SECURITY;

-- Re-enable RLS for amenities table
ALTER TABLE amenities ENABLE ROW LEVEL SECURITY;

-- Verify RLS is enabled
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE tablename IN ('properties', 'property_images', 'property_amenities', 'amenities')
AND schemaname = 'public';

-- Your existing RLS policies should now work correctly with authentication
-- The DELETE policies require auth.role() = 'authenticated' which will now work
