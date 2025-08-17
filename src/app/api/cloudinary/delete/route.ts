import { NextRequest, NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'

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

    // Use Cloudinary SDK for deletion (more reliable than manual signature generation)
    try {
      const result = await cloudinary.uploader.destroy(publicId)
      
      if (result.result === 'ok' || result.result === 'not found') {
        return NextResponse.json({
          success: true,
          message: 'Image deleted successfully',
          result
        })
      } else {
        console.error('Cloudinary deletion failed:', result)
        return NextResponse.json(
          { error: 'Failed to delete image from Cloudinary' },
          { status: 500 }
        )
      }
    } catch (cloudinaryError) {
      console.error('Cloudinary SDK error:', cloudinaryError)
      return NextResponse.json(
        { error: 'Failed to delete image from Cloudinary' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Error deleting image:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}


