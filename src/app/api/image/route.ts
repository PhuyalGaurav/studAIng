import { NextRequest, NextResponse } from 'next/server';
import { uploadFile } from '@/utils/s3Bucket';
import sharp from 'sharp';
import crypto from 'crypto';

const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB

const generateFileName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex');

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('image') as File | null;

    console.log(formData)

    if (!file) {
      return NextResponse.json({ error: 'Image file is required' }, { status: 400 });
    }

    if (file.size > MAX_IMAGE_SIZE) {
      return NextResponse.json({ error: 'Image file is too large' }, { status: 413 });
    }

    const imageName = generateFileName();
    const buffer = await file.arrayBuffer();
    const fileBuffer = await sharp(Buffer.from(buffer)).toBuffer();

    await uploadFile(fileBuffer, imageName, file.type);

    return NextResponse.json({ imageName }, { status: 201 });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}