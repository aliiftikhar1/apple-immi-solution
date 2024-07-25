import { NextResponse } from 'next/server';
import prisma from '../../util/prisma';
import { header } from 'express/lib/request';

export async function POST(request) {
  if (request.method === 'OPTIONS') {
    const headers = {
      'Access-Control-Allow-Origin': '*', // Change to your frontend URL in production
      'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };
    return new Response(null, { status: 204, headers });
  } if (request.method === 'OPTIONS') {
    const headers = {
      'Access-Control-Allow-Origin': '*', // Change to your frontend URL in production
      'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };
    return new Response(null, { status: 204, headers });
  }
  try {
    const data = await request.json();
    const { title, city, address } = data;
    const newBranch = await prisma.Branches.create({
      data: {
        title,
        city,
        address,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    return NextResponse.json(newBranch);
  } catch (error) {
    console.error('Error creating branch', error);
    return NextResponse.json(
      {
        message: 'Failed to create branch',
        status: false,
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}

export async function GET() {
  try {
    const branches = await prisma.branches.findMany();
    return NextResponse.json(branches);
  } catch (error) {
    console.error('Error fetching branches:', error);
    return NextResponse.json(
      {
        message: 'Failed to fetch branches',
        status: false,
        error: error.message,
      },
      {
        status: 500,
        headers:header
      }
    );
  }
}
