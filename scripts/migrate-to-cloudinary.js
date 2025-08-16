const { uploadAllImages } = require('./upload-images-to-cloudinary');
const { updateProperties } = require('./update-properties-with-cloudinary');

async function migrateToCloudinary() {
  try {
    console.log('🚀 Starting complete migration to Cloudinary...\n');
    console.log('=' .repeat(60));
    
    // Step 1: Upload all images
    console.log('\n📤 STEP 1: Uploading images to Cloudinary');
    console.log('=' .repeat(40));
    await uploadAllImages();
    
    // Wait a moment for files to be written
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Step 2: Update properties with Cloudinary URLs
    console.log('\n🔄 STEP 2: Updating properties with Cloudinary URLs');
    console.log('=' .repeat(50));
    updateProperties();
    
    console.log('\n🎉 Migration completed successfully!');
    console.log('\n📝 What happened:');
    console.log('  1. ✅ All images uploaded to Cloudinary');
    console.log('  2. ✅ Properties updated with Cloudinary URLs');
    console.log('  3. ✅ Backup of original properties created');
    console.log('  4. ✅ Mapping file generated for reference');
    
    console.log('\n🔍 Next steps:');
    console.log('  1. Check your properties listing page');
    console.log('  2. Verify images are displaying from Cloudinary');
    console.log('  3. Test the add property functionality');
    console.log('  4. Consider removing local image files');
    
    console.log('\n📁 Files created:');
    console.log('  - src/data/cloudinary-image-mapping.json');
    console.log('  - src/app/data/properties.backup.ts');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run the migration
if (require.main === module) {
  migrateToCloudinary();
}

module.exports = { migrateToCloudinary };
