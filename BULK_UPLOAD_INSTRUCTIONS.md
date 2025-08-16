# 🚀 Bulk Image Upload to Cloudinary

This guide will help you upload all your existing images from `/public/images/` to Cloudinary.

## 📋 Prerequisites

1. **Cloudinary Account**: Make sure you have access to your `tony-properties` cloud
2. **API Credentials**: Get your API key and secret from Cloudinary dashboard

## 🔧 Setup

### 1. Create Environment File
Create a `.env.upload` file in your project root with:

```bash
CLOUDINARY_CLOUD_NAME=tony-properties
CLOUDINARY_API_KEY=your-actual-api-key
CLOUDINARY_API_SECRET=your-actual-api-secret
```

### 2. Install Dependencies
```bash
npm install cloudinary
```

## 🚀 Run the Migration

### Option 1: Complete Migration (Recommended)
```bash
npm run migrate-to-cloudinary
```
This runs both upload and property update in sequence.

### Option 2: Step by Step
```bash
# Step 1: Upload images only
npm run upload-images

# Step 2: Update properties with Cloudinary URLs
npm run update-properties
```

### Option 3: Direct execution
```bash
# Complete migration
node scripts/migrate-to-cloudinary.js

# Or individual steps
node scripts/upload-images-to-cloudinary.js
node scripts/update-properties-with-cloudinary.js
```

## 📁 What Gets Uploaded

The script will upload all images from `/public/images/`:
- `about-banner-1.png`
- `about-banner-2.jpg`
- `blog-1.png`
- `blog-2.jpg`
- `blog-3.jpg`
- `hero-banner-1.jpg`
- `hero-banner-2.png`
- `kitchen-1940174_1280.jpg`
- `kitchen-7850352_1280.jpg`
- `property-1.jpg`
- `property-2.jpg`
- `property-3.jpg`
- `property-4.png`
- `property-5.jpg`
- `service-1.png`
- `service-2.png`
- `service-3.png`

## 📊 Output

The script will:
1. **Upload each image** to Cloudinary in the `tony-properties` folder
2. **Generate a mapping file** at `src/data/cloudinary-image-mapping.json`
3. **Show progress** for each upload
4. **Display summary** of successful and failed uploads

## 🔄 After Upload

Once all images are uploaded, you can:
1. **Update your properties data** to use Cloudinary URLs
2. **Remove local images** from `/public/images/` (optional)
3. **Use the mapping file** to reference Cloudinary URLs

## 🆘 Troubleshooting

### Rate Limiting
- The script includes a 500ms delay between uploads
- If you hit rate limits, increase the delay in the script

### Authentication Errors
- Verify your API key and secret are correct
- Ensure your Cloudinary account has upload permissions

### File Not Found
- Make sure the `/public/images/` folder exists
- Check that image files have valid extensions (.jpg, .png, .gif, .webp)

## 📝 Next Steps

After successful upload:
1. Check the generated mapping file
2. Update your properties data to use Cloudinary URLs
3. Test that images display correctly
4. Consider removing local image files to save space

---

**Need help?** Check the Cloudinary documentation or contact support.
