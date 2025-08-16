const fs = require('fs');
const path = require('path');
const { v2: cloudinary } = require('cloudinary');

// Load environment variables from .env.upload file
require('dotenv').config({ path: '.env.upload' });

// Cloudinary configuration
console.log('🔍 Environment Variables Debug:');
console.log('  CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME);
console.log('  CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY ? '***SET***' : 'NOT SET');
console.log('  CLOUDINARY_API_SECRET:', process.env.CLOUDINARY_API_SECRET ? '***SET***' : 'NOT SET');
console.log('');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'tony-properties',
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Path to your images folder
const IMAGES_FOLDER = path.join(__dirname, '../public/images');

// Function to upload a single image
async function uploadImageToCloudinary(imagePath, fileName) {
  try {
    console.log(`📤 Uploading: ${fileName}`);
    
    const result = await cloudinary.uploader.upload(imagePath, {
      folder: 'tony-properties',
      public_id: path.parse(fileName).name, // Use filename without extension as public_id
      overwrite: false, // Don't overwrite existing images
      resource_type: 'image'
    });
    
    console.log(`✅ Uploaded: ${fileName} -> ${result.secure_url}`);
    return {
      fileName,
      originalPath: imagePath,
      cloudinaryUrl: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      size: result.bytes
    };
  } catch (error) {
    console.error(`❌ Failed to upload ${fileName}:`, error.message);
    return null;
  }
}

// Function to get all image files from the folder
function getImageFiles(folderPath) {
  const files = fs.readdirSync(folderPath);
  return files.filter(file => {
    const ext = path.extname(file).toLowerCase();
    return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
  });
}

// Main function to upload all images
async function uploadAllImages() {
  try {
    console.log('🚀 Starting bulk image upload to Cloudinary...\n');
    
    // Check if images folder exists
    if (!fs.existsSync(IMAGES_FOLDER)) {
      console.error('❌ Images folder not found:', IMAGES_FOLDER);
      return;
    }
    
    // Get all image files
    const imageFiles = getImageFiles(IMAGES_FOLDER);
    console.log(`📁 Found ${imageFiles.length} images to upload:\n`);
    
    // Upload each image
    const uploadResults = [];
    for (const fileName of imageFiles) {
      const imagePath = path.join(IMAGES_FOLDER, fileName);
      const result = await uploadImageToCloudinary(imagePath, fileName);
      if (result) {
        uploadResults.push(result);
      }
      // Add a small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    // Generate the mapping file
    const mappingData = {
      uploadedAt: new Date().toISOString(),
      totalImages: imageFiles.length,
      successfulUploads: uploadResults.length,
      failedUploads: imageFiles.length - uploadResults.length,
      images: uploadResults
    };
    
    // Save mapping to file
    const mappingPath = path.join(__dirname, '../src/data/cloudinary-image-mapping.json');
    fs.writeFileSync(mappingPath, JSON.stringify(mappingData, null, 2));
    
    console.log('\n📊 Upload Summary:');
    console.log(`✅ Successfully uploaded: ${uploadResults.length}`);
    console.log(`❌ Failed uploads: ${imageFiles.length - uploadResults.length}`);
    console.log(`📄 Mapping saved to: ${mappingPath}`);
    
    // Display all uploaded images
    console.log('\n🖼️  Uploaded Images:');
    uploadResults.forEach(result => {
      console.log(`  ${result.fileName} -> ${result.cloudinaryUrl}`);
    });
    
  } catch (error) {
    console.error('❌ Bulk upload failed:', error);
  }
}

// Run the script
if (require.main === module) {
  uploadAllImages();
}

module.exports = { uploadAllImages };
