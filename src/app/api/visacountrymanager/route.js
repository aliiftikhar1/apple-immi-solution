// pages/api/visacountrymanager.js

import { NextResponse } from 'next/server';
import prisma from '../../util/prisma';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const country = searchParams.get('country');

    if (!country || !userId) {
      return NextResponse.json(
        {
          message: 'Country and User ID are required',
          status: false,
        },
        { status: 400 }
      );
    }

    const branchid = await prisma.$queryRaw`SELECT * FROM AdminUser WHERE id = ${userId}`;
    if (branchid.length === 0) {
      return NextResponse.json(
        {
          message: 'User not found',
          status: false,
        },
        { status: 404 }
      );
    }

    const bcode = branchid[0].branch;

    const customer = await prisma.$queryRaw`
      SELECT Customer.*, AdminUser.branch, AdminUser.id, AdminUser.imgurl as imageurl
      FROM Customer
      INNER JOIN AdminUser ON Customer.addedby = AdminUser.id
      WHERE AdminUser.branch = ${bcode} AND Customer.Visa_Country = ${country}
    `;

    return NextResponse.json(customer);
  } catch (error) {
    console.error('Error fetching customer:', error);
    return NextResponse.json(
      {
        message: 'Failed to fetch customer',
        status: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
