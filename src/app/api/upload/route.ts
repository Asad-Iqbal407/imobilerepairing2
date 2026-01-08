import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Check file size (limit to 2MB to prevent large DB documents)
    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size too large. Max 2MB allowed.' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Convert to Base64 Data URI
    // This allows images to be stored directly in the database string field
    // without needing external storage (S3/Cloudinary) or local filesystem (which fails on Vercel)
    const mimeType = file.type || 'image/jpeg';
    const base64 = buffer.toString('base64');
    const dataUri = `data:${mimeType};base64,${base64}`;

    return NextResponse.json({ url: dataUri });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
  }
}
