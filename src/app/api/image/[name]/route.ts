import { NextResponse } from 'next/server';
import { getObjectSignedUrl } from '@/utils/s3Bucket'; 

function isValidUrl(url : string) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export async function GET(req: Request, { params }: { params: { name: string } }) {
  const { name } = params

  if (!name) {
    return NextResponse.json({ error: "Missing 'name' parameter" }, { status: 400 });
  }

  try {
    const imageUrl = await getObjectSignedUrl(name as string);

    if (!isValidUrl(imageUrl)) { 
      return NextResponse.json({ error: 'Failed to generate signed URL' }, { status: 500 });
    }

    return NextResponse.json({ imageUrl }, { status: 200 });
  } catch (error) {
    console.error('Error fetching signed URL:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}