import { NextResponse } from 'next/server';
import prisma from '../../util/prisma';

export async function POST(request) {
  try {
    const data = await request.json();
    const { user, images } = data;

    if (!images || images.length === 0) {
      throw new Error('No images provided');
    }

    // Upload the images and get their URLs
    const uploadedImages = await Promise.all(images.map(async (img) => {
      const response = await fetch('https://appstore.store2u.ca/uploadImage.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: img.base64 }),
      });
      const result = await response.json();
      if (response.ok) {
        return {
          user: user,
          imgurl: result.image_url,
          type: img.type,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      } else {
        throw new Error(result.error || 'Failed to upload image');
      }
    }));

    // Save the image details to the database
    const createdImages = await Promise.all(uploadedImages.map(async (image) => {
      return await prisma.images.create({
        data: image,
      });
    }));

    return NextResponse.json({
      status: 200,
      message: 'Images uploaded and saved successfully',
      data: createdImages,
    });
  } catch (error) {
    console.error('Error creating images:', error);
    return NextResponse.json(
      {
        message: 'Failed to create images',
        status: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const images = await prisma.images.findMany();
    return NextResponse.json(images);
  } catch (error) {
    console.error('Error fetching images:', error);
    return NextResponse.json(
      {
        message: 'Failed to fetch images',
        status: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
