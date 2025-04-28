import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const projectId = formData.get('projectId') as string;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileBase64 = `data:${file.type};base64,${buffer.toString('base64')}`;

    // Create folder path based on projectId
    const folderPath = projectId ? `projects/${projectId}` : 'my_uploads';
    
    console.log(`Uploading to Cloudinary in folder: ${folderPath}`);
    
    // Upload to Cloudinary with projectId as folder name if provided
    const result = await cloudinary.uploader.upload(fileBase64, {
      folder: folderPath,
      resource_type: 'auto',
      use_filename: true,
      unique_filename: true,
    });

    console.log(`Upload successful: ${result.secure_url}`);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
} 