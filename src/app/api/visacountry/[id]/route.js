import { NextResponse } from 'next/server';
import prisma from '../../../util/prisma';

export async function GET(request) {
  try {
    // Extract country from the query parameters
    const url = new URL(request.url);
    const country = url.searchParams.get('country');

    if (!country) {
      return NextResponse.json(
        {
          message: 'Country is required',
          status: false,
        },
        { status: 400 }
      );
    }

    // Query the database
    const customers = await prisma.$queryRaw`
      SELECT * FROM customer WHERE Visa_Country = ${country}
    `;

    return NextResponse.json(customers);
  } catch (error) {
    console.error('Error fetching customers:', error);
    return NextResponse.json(
      {
        message: 'Failed to fetch customers',
        status: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
