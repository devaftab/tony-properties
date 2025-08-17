// Image Upload Utility for Cloudinary
// This file handles all image upload operations for the property management system

export interface UploadedImage {
  id: string
  url: string
  publicId: string
  width: number
  height: number
  format: string
  size: number
}

export interface UploadProgress {
  loaded: number
  total: number
  percentage: number
}

export class ImageUploadError extends Error {
  constructor(message: string, public code?: string) {
    super(message)
    this.name = 'ImageUploadError'
    this.code = code
  }
}

// Cloudinary configuration
const CLOUDINARY_CONFIG = {
  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'tony-properties',
  uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'tony-properties-upload',
  apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
  maxImages: 10
}

// Validate file before upload
export const validateImageFile = (file: File): void => {
  // Check file size
  if (file.size > CLOUDINARY_CONFIG.maxFileSize) {
    throw new ImageUploadError(
      `File size (${(file.size / 1024 / 1024).toFixed(2)}MB) exceeds maximum allowed size of ${CLOUDINARY_CONFIG.maxFileSize / 1024 / 1024}MB`
    )
  }

  // Check file format
  const fileExtension = file.name.split('.').pop()?.toLowerCase()
  if (!fileExtension || !CLOUDINARY_CONFIG.allowedFormats.includes(fileExtension)) {
    throw new ImageUploadError(
      `File format .${fileExtension} is not supported. Allowed formats: ${CLOUDINARY_CONFIG.allowedFormats.join(', ')}`
    )
  }

  // Check if file is actually an image
  if (!file.type.startsWith('image/')) {
    throw new ImageUploadError('Selected file is not an image')
  }
}

// Upload single image to Cloudinary
export const uploadImageToCloudinary = async (
  file: File,
  onProgress?: (progress: UploadProgress) => void
): Promise<UploadedImage> => {
  try {
    // Validate file
    validateImageFile(file)

    // Validate Cloudinary configuration
    if (!CLOUDINARY_CONFIG.cloudName || !CLOUDINARY_CONFIG.uploadPreset) {
      throw new ImageUploadError('Cloudinary configuration is incomplete')
    }

    // Create FormData
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset)
    formData.append('cloud_name', CLOUDINARY_CONFIG.cloudName)
    
    // Add folder parameter (allowed in unsigned uploads)
    formData.append('folder', 'tony-properties')

    // Create XMLHttpRequest for progress tracking
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()

      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable && onProgress) {
          const progress: UploadProgress = {
            loaded: event.loaded,
            total: event.total,
            percentage: Math.round((event.loaded / event.total) * 100)
          }
          onProgress(progress)
        }
      })

      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          try {
            const response = JSON.parse(xhr.responseText)
            const uploadedImage: UploadedImage = {
              id: response.public_id,
              url: response.secure_url,
              publicId: response.public_id,
              width: response.width,
              height: response.height,
              format: response.format,
              size: response.bytes
            }
            resolve(uploadedImage)
          } catch {
            reject(new ImageUploadError('Failed to parse upload response'))
          }
        } else {
          // Enhanced error logging
          let errorMessage = `Upload failed with status: ${xhr.status}`
          try {
            const errorResponse = JSON.parse(xhr.responseText)
            if (errorResponse.error?.message) {
              errorMessage += ` - ${errorResponse.error.message}`
            }
          } catch {
            // If we can't parse the error, use the raw response
            if (xhr.responseText) {
              errorMessage += ` - ${xhr.responseText}`
            }
          }
          
          reject(new ImageUploadError(errorMessage))
        }
      })

      xhr.addEventListener('error', () => {
        reject(new ImageUploadError('Network error during upload'))
      })

      xhr.addEventListener('abort', () => {
        reject(new ImageUploadError('Upload was aborted'))
      })

      // Open and send request
      const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`
      xhr.open('POST', uploadUrl)
      xhr.send(formData)
    })

  } catch (error) {
    if (error instanceof ImageUploadError) {
      throw error
    }
    throw new ImageUploadError('Unknown error during upload')
  }
}

// Upload multiple images with progress tracking
export const uploadMultipleImages = async (
  files: File[],
  onImageProgress?: (imageIndex: number, progress: UploadProgress) => void,
  onImageComplete?: (imageIndex: number, result: UploadedImage) => void
): Promise<UploadedImage[]> => {
  // Validate total number of images
  if (files.length > CLOUDINARY_CONFIG.maxImages) {
    throw new ImageUploadError(
      `Maximum ${CLOUDINARY_CONFIG.maxImages} images allowed. You selected ${files.length} images.`
    )
  }

  const uploadPromises = files.map((file, index) => {
    return uploadImageToCloudinary(file, (progress) => {
      if (onImageProgress) {
        onImageProgress(index, progress)
      }
    }).then((result) => {
      if (onImageComplete) {
        onImageComplete(index, result)
      }
      return result
    })
  })

  return Promise.all(uploadPromises)
}

// Delete image from Cloudinary
export const deleteImageFromCloudinary = async (publicId: string): Promise<void> => {
  try {
    const response = await fetch(`/api/cloudinary/delete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ publicId }),
    })

    if (!response.ok) {
      throw new Error('Failed to delete image')
    }
  } catch (error) {
    throw new ImageUploadError(`Failed to delete image: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// Generate optimized image URLs for different use cases
export const getOptimizedImageUrl = (
  originalUrl: string,
  options: {
    width?: number
    height?: number
    quality?: number
    format?: 'auto' | 'webp' | 'jpg' | 'png'
    crop?: 'fill' | 'scale' | 'fit' | 'thumb'
  } = {}
): string => {
  const { width, height, quality = 'auto', format = 'auto', crop = 'fill' } = options
  
  if (!originalUrl.includes('cloudinary.com')) {
    return originalUrl
  }

  // Parse the URL to insert transformations
  const urlParts = originalUrl.split('/upload/')
  if (urlParts.length !== 2) {
    return originalUrl
  }

  const transformations = []
  
  if (width || height) {
    if (width && height) {
      transformations.push(`c_${crop},w_${width},h_${height}`)
    } else if (width) {
      transformations.push(`c_${crop},w_${width}`)
    } else if (height) {
      transformations.push(`c_${crop},h_${height}`)
    }
  }
  
  if (quality !== 'auto' && typeof quality === 'number') {
    transformations.push(`q_${quality}`)
  }
  
  if (format !== 'auto') {
    transformations.push(`f_${format}`)
  }

  const transformationString = transformations.length > 0 ? transformations.join('/') + '/' : ''
  const finalUrl = `${urlParts[0]}/upload/${transformationString}${urlParts[1]}`
  
  return finalUrl
}

// Utility functions for common image operations
export const imageUtils = {
  // Get thumbnail URL (small preview)
  getThumbnail: (url: string, size: number = 150) => 
    getOptimizedImageUrl(url, { width: size, height: size, crop: 'thumb', quality: 80 }),
  
  // Get medium size for property cards
  getMedium: (url: string, width: number = 400) => 
    getOptimizedImageUrl(url, { width, height: 300, crop: 'fill', quality: 85 }),
  
  // Get large size for property detail pages
  getLarge: (url: string, width: number = 800) => 
    getOptimizedImageUrl(url, { width, height: 600, crop: 'fill', quality: 90 }),
  
  // Get original with webp format for better performance
  getOptimized: (url: string) => 
    getOptimizedImageUrl(url, { format: 'webp', quality: 85 })
}

// Environment variables validation
export const validateCloudinaryConfig = (): void => {
  const requiredVars = [
    'NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME',
    'NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET'
  ]

  const missingVars = requiredVars.filter(varName => !process.env[varName])
  
  if (missingVars.length > 0) {
    console.warn(
      'Missing Cloudinary environment variables:',
      missingVars.join(', '),
      '\nPlease add these to your .env.local file'
    )
  }
}

// Initialize configuration validation
if (typeof window !== 'undefined') {
  validateCloudinaryConfig()
}
