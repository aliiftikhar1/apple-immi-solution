// pages/api/admin/[id]/route.js
import { NextResponse } from 'next/server';
import prisma from '../../../util/prisma';
import bcrypt from 'bcryptjs'; 

export async function GET(request, { params }) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const admin = await prisma.adminUser.findUnique({ where: { id } });
    if (admin) {
      return NextResponse.json(admin);
    } else {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error fetching admin user:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const body = await request.json();
    const { name, age, cnic, country, city, branch, role, email, password, imgurl, base64 } = body;

    const admin = await prisma.adminUser.findUnique({ where: { id } });
    if (!admin) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
    }

    let hashedPassword = admin.password;
    if (password && password !== admin.password) {
      const salt = bcrypt.genSaltSync(10);
      hashedPassword = bcrypt.hashSync(password, salt);
    }

    const response = await fetch('https://admin.applelegal.co/uploadImage.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ image: base64 }),
    });

    if (!response.ok) {
      throw new Error('Failed to upload image');
    }

    const result = await response.json();
    const updatedAdmin = await prisma.adminUser.update({
      where: { id },
      data: {
        name,
        age,
        cnic,
        country,
        city,
        branch,
        role,
        email,
        password: hashedPassword,
        imgurl: result.image_url,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(updatedAdmin);
  } catch (error) {
    console.error('Error updating admin user:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    await prisma.adminUser.delete({ where: { id } });
    return NextResponse.json({ message: 'Admin deleted successfully' });
  } catch (error) {
    console.error('Error deleting admin user:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
