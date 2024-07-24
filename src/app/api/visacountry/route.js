import { NextResponse } from 'next/server';
import prisma from '../../util/prisma';

export async function POST(request) {
  try {
    const body = await request.json();
    const { country } = body;

    if (!country) {
      return NextResponse.json(
        {
          message: 'Country is required',
          status: false,
        },
        { status: 400 }
      );
    }

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
