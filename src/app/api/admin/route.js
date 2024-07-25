import { NextResponse } from 'next/server';
import prisma from '../../util/prisma';
import bcrypt from 'bcryptjs'; // Import bcryptjs
import { header } from 'express/lib/request';

// POST request to create a new admin user
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
    const body = await request.json();
    const { name, age, cnic, country, city, branch, role, email, password, imgurl, base64 } = body;

    console.log(base64);
    // Hash the password using bcryptjs
    const salt = bcrypt.genSaltSync(10); // Generate a salt
    const hashedPassword = bcrypt.hashSync(password, salt); // Hash the password

    
    const response = await fetch('https://admin.applelegal.co/uploadImage.php', { // Replace with your actual endpoint URL
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ image: base64 }),
    });
  
    const result = await response.json();
    if (response.ok) {
      console.log('Image URL:', result.image_url);
  
    const newAdmin = await prisma.adminUser.create({
      data: {
        name,
        age,
        cnic,
        country,
        city,
        branch,
        role,
        email,
        password: hashedPassword, // Save the hashed password
        imgurl: result.image_url,
        // imgurl: result.image_url, // Save the GitHub file URL in the database
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    return NextResponse.json(newAdmin);
  } 
}catch (error) {
    console.error('Error creating admin user:', error);
    return NextResponse.json(
      {
        message: 'Failed to create admin user',
        status: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// GET request to fetch all admin users
export async function GET() {
  try {
    const admins = await prisma.adminUser.findMany();
    return NextResponse.json(admins);
  } catch (error) {
    console.error('Error fetching admin users:', error);
    return NextResponse.json(
      {
        message: 'Failed to fetch admin users',
        status: false,
        error: error.message,
      },
      { status: 500,
        headers: header
       }
    );
  }
}
