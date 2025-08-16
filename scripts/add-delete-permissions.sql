-- Add DELETE permissions to existing RLS policies
-- Run this in your Supabase SQL Editor

-- Add DELETE policy for properties table
CREATE POLICY "Enable delete for authenticated users" ON properties
    FOR DELETE USING (auth.role() = 'authenticated');

-- Add DELETE policy for property_images table
CREATE POLICY "Enable delete for authenticated users" ON property_images
    FOR DELETE USING (auth.role() = 'authenticated');

-- Add DELETE policy for property_amenities table
CREATE POLICY "Enable delete for authenticated users" ON property_amenities
    FOR DELETE USING (auth.role() = 'authenticated');

-- Add DELETE policy for amenities table
CREATE POLICY "Enable delete for authenticated users" ON amenities
    FOR DELETE USING (auth.role() = 'authenticated');

-- Verify the new policies were created
SELECT schemaname, tablename, policyname, cmd, qual
FROM pg_policies 
WHERE tablename IN ('properties', 'property_images', 'property_amenities', 'amenities')
AND cmd = 'DELETE';
