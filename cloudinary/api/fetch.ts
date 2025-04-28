// app/api/images/route.ts
import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function GET() {
  try {
    // Get images from a specific folder
    const result = await cloudinary.search
      .expression('folder:my_uploads')
      .sort_by('created_at', 'desc')
      .max_results(30)
      .execute();
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching images:', error);
    return NextResponse.json({ error: 'Failed to fetch images' }, { status: 500 });
  }
}
