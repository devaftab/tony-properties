-- Add UPDATE permissions to existing RLS policies
-- Run this in your Supabase SQL Editor

-- Add UPDATE policy for properties table
CREATE POLICY "Enable update for authenticated users" ON properties
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Add UPDATE policy for property_images table
CREATE POLICY "Enable update for authenticated users" ON property_images
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Add UPDATE policy for property_amenities table
CREATE POLICY "Enable update for authenticated users" ON property_amenities
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Add UPDATE policy for amenities table
CREATE POLICY "Enable update for authenticated users" ON amenities
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Verify the new policies were created
SELECT schemaname, tablename, policyname, cmd, qual
FROM pg_policies 
WHERE tablename IN ('properties', 'property_images', 'property_amenities', 'amenities')
AND cmd = 'UPDATE';
