# Cloudinary Setup Guide for Tony Properties

This guide will help you set up Cloudinary for image management in your property management system.

## 🚀 Quick Start

### 1. Create Cloudinary Account
1. Go to [Cloudinary.com](https://cloudinary.com) and sign up for a free account
2. Verify your email address

### 2. Get Your Credentials
1. Log into your Cloudinary dashboard
2. Note down your **Cloud Name** (found in the main dashboard)
3. Go to **Settings > Access Keys** to get your **API Key** and **API Secret**

### 3. Create Upload Preset
1. Go to **Settings > Upload > Upload presets**
2. Click **Add upload preset**
3. Set **Preset name** to `tony-properties-upload`
4. Set **Signing Mode** to `Unsigned` (for client-side uploads)
5. Set **Folder** to `tony-properties` (recommended)
6. Click **Save**

### 4. Environment Variables
Create a `.env.local` file in your project root with:

```bash
# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=tony-properties
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=tony-properties-upload
NEXT_PUBLIC_CLOUDINARY_API_KEY=your-api-key

# Server-side credentials (for secure operations)
CLOUDINARY_CLOUD_NAME=tony-properties
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

**Replace the values with your actual Cloudinary credentials.**

## 🔧 Configuration Details

### Upload Preset Settings
- **Signing Mode**: `Unsigned` (allows client-side uploads)
- **Folder**: `tony-properties` (organizes your images)
- **Allowed Formats**: `jpg, jpeg, png, gif, webp`
- **Max File Size**: `10MB` (adjust as needed)
- **Transformation**: `f_auto,q_auto,w_1200,h_800,c_fill`

### Security Considerations
- **Client-side**: Only cloud name and upload preset are exposed
- **Server-side**: API key and secret are kept secure
- **Image deletion**: Requires server-side authentication

## 📱 Usage Examples

### Upload Images
```typescript
import { uploadImageToCloudinary } from '@/lib/imageUpload'

const handleUpload = async (file: File) => {
  try {
    const result = await uploadImageToCloudinary(file, (progress) => {
      console.log(`Upload progress: ${progress.percentage}%`)
    })
    
    console.log('Uploaded image:', result.url)
  } catch (error) {
    console.error('Upload failed:', error.message)
  }
}
```

### Get Optimized URLs
```typescript
import { imageUtils } from '@/lib/imageUpload'

// Thumbnail for property cards
const thumbnailUrl = imageUtils.getThumbnail(imageUrl, 150)

// Medium size for property listings
const mediumUrl = imageUtils.getMedium(imageUrl, 400)

// Large size for property details
const largeUrl = imageUtils.getLarge(imageUrl, 800)
```

## 🎯 Features

### ✅ What's Included
- **Multiple image uploads** with progress tracking
- **Automatic image optimization** (format, quality, size)
- **Responsive image URLs** for different use cases
- **Secure image deletion** with server-side authentication
- **File validation** (size, format, type)
- **Error handling** with custom error classes
- **TypeScript support** with full type definitions

### 🚫 Limitations
- **Free tier**: 25GB storage, 25GB bandwidth/month
- **File size**: Maximum 10MB per image
- **Formats**: JPG, PNG, GIF, WebP only
- **Images per property**: Maximum 10 images

## 🔍 Troubleshooting

### Common Issues

#### 1. "Upload preset not found"
- Verify your upload preset name in `.env.local`
- Check that the preset is set to "Unsigned" mode

#### 2. "Invalid signature" error
- Ensure your API key and secret are correct
- Check that server-side environment variables are set

#### 3. "File too large" error
- Increase `CLOUDINARY_MAX_FILE_SIZE` in environment
- Or reduce image size before upload

#### 4. Images not displaying
- Check browser console for CORS errors
- Verify cloud name is correct
- Ensure upload preset allows the image format

### Debug Mode
Add this to your `.env.local` for debugging:
```bash
NODE_ENV=development
DEBUG=cloudinary:*
```

## 📊 Monitoring & Analytics

### Cloudinary Dashboard
- **Usage**: Monitor storage and bandwidth usage
- **Analytics**: View image performance metrics
- **Transformations**: Track optimization usage

### Logs
Check your application logs for:
- Upload success/failure rates
- File size and format statistics
- Error patterns and frequency

## 🔒 Security Best Practices

1. **Never expose API secret** in client-side code
2. **Use unsigned uploads** for client-side operations
3. **Validate file types** before upload
4. **Implement file size limits**
5. **Use secure deletion** for sensitive images
6. **Monitor usage** to prevent abuse

## 📈 Scaling Considerations

### When to Upgrade
- **Storage**: Exceeding 25GB free limit
- **Bandwidth**: High traffic properties
- **Features**: Need advanced transformations
- **Support**: Require priority assistance

### Enterprise Features
- **Advanced transformations**
- **AI-powered optimization**
- **Custom domains**
- **Priority support**
- **SLA guarantees**

## 🆘 Support

### Resources
- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Next.js Integration Guide](https://cloudinary.com/documentation/next_js_integration)
- [API Reference](https://cloudinary.com/documentation/admin_api)

### Community
- [Cloudinary Community](https://support.cloudinary.com)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/cloudinary)
- [GitHub Issues](https://github.com/cloudinary/cloudinary_npm/issues)

---

**Need help?** Check the troubleshooting section above or reach out to the Cloudinary support team.
