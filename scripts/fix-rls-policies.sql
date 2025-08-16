-- Fix RLS Policies for Property Deletion
-- Run this in your Supabase SQL Editor

-- First, let's check current RLS status
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('properties', 'property_images', 'property_amenities', 'amenities');

-- Check current RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename IN ('properties', 'property_images', 'property_amenities', 'amenities');

-- Drop existing policies that might be blocking deletion
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON properties;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON property_images;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON property_amenities;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON amenities;

-- Create new policies that allow DELETE operations
-- Properties table
CREATE POLICY "Enable all operations for authenticated users" ON properties
    FOR ALL USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- Property images table
CREATE POLICY "Enable all operations for authenticated users" ON property_images
    FOR ALL USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- Property amenities table
CREATE POLICY "Enable all operations for authenticated users" ON property_amenities
    FOR ALL USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- Amenities table
CREATE POLICY "Enable all operations for authenticated users" ON amenities
    FOR ALL USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- Alternative: If you want more restrictive policies, use this instead:
-- CREATE POLICY "Enable delete for authenticated users" ON properties
--     FOR DELETE USING (auth.role() = 'authenticated');

-- Verify the new policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename IN ('properties', 'property_images', 'property_amenities', 'amenities');

-- Test if we can now delete (this should work)
-- Note: You might need to run this in a separate query after the policies are created
-- DELETE FROM properties WHERE id = 999999; -- Use a non-existent ID to test
