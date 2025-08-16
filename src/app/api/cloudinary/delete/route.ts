import { NextRequest, NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'
import crypto from 'crypto'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(request: NextRequest) {
  try {
    // Verify environment variables
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      return NextResponse.json(
        { error: 'Cloudinary configuration is incomplete' },
        { status: 500 }
      )
    }

    const { publicId } = await request.json()

    if (!publicId) {
      return NextResponse.json(
        { error: 'Public ID is required' },
        { status: 400 }
      )
    }

    // Create signature for secure deletion
    const timestamp = Math.round(new Date().getTime() / 1000)
    const signature = generateSignature(publicId, timestamp)

    // Prepare deletion request
    const formData = new FormData()
    formData.append('public_id', publicId)
    formData.append('api_key', process.env.CLOUDINARY_API_KEY!)
    formData.append('timestamp', timestamp.toString())
    formData.append('signature', signature)

    // Send deletion request to Cloudinary
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/destroy`,
      {
        method: 'POST',
        body: formData
      }
    )

    if (!response.ok) {
      const errorData = await response.text()
      console.error('Cloudinary deletion failed:', errorData)
      return NextResponse.json(
        { error: 'Failed to delete image from Cloudinary' },
        { status: response.status }
      )
    }

    const result = await response.json()

    return NextResponse.json({
      success: true,
      message: 'Image deleted successfully',
      result
    })

  } catch (error) {
    console.error('Error deleting image:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Generate HMAC signature for Cloudinary API
function generateSignature(publicId: string, timestamp: number): string {
  const params = {
    public_id: publicId,
    timestamp: timestamp
  }

  // Create signature string
  const signatureString = Object.keys(params)
    .sort()
    .map(key => `${key}=${params[key as keyof typeof params]}`)
    .join('&')

  // Generate HMAC signature
  const signature = crypto
    .createHmac('sha1', process.env.CLOUDINARY_API_SECRET!)
    .update(signatureString)
    .digest('hex')

  return signature
}
