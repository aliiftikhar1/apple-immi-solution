import { NextResponse } from 'next/server';
import prisma from '../../util/prisma';

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        {
          message: 'Email is required',
          status: false,
        },
        { status: 400 }
      );
    }

    const images = await prisma.images.findMany({
      where: { user: email },
    });

    if (!images.length) {
      return NextResponse.json(
        {
          message: 'No images found for the given user',
          status: false,
        },
        { status: 404 }
      );
    }

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
