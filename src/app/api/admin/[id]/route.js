import { NextResponse } from 'next/server';
import prisma from "../../../util/prisma";
import bcrypt from 'bcryptjs'; // Import bcryptjs


// GET request to fetch a specific admin user by ID
export async function GET(request, { params }) {
  try {
    const id = parseInt(params.id);
    const admin = await prisma.adminUser.findUnique({ where: { id } });
    if (admin) {
      return NextResponse.json(admin);
    } else {
      return NextResponse.json({ error: 'Admin not found' });
    }
  } catch (error) {
    console.error('Error fetching admin user:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT request to update a specific admin user by ID
export async function PUT(request, { params }) {
  try {
    const id = parseInt(params.id);
    
    const body = await request.json();
    const {  name, age, cnic, country, city, branch, role, email, password, imgurl, base64 } = body;

    console.log(base64);
    // Hash the password using bcryptjs
    const admin = await prisma.adminUser.findUnique({ where: { id } });
    if (!admin) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
    }
    let hashedPassword=admin.password
    if (!(password === admin.password)) {
      const salt = bcrypt.genSaltSync(10);
      hashedPassword = bcrypt.hashSync(password, salt);
    }


    
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
  


    const updatedAdmin = await prisma.adminUser.update({
      where: { id: id },
      data: { name,
        age,
        cnic,
        country,
        city,
        branch,
        role,
        email,
        password: hashedPassword, // Save the hashed password
        imgurl: result.image_url,
        updatedAt: new Date(), },
    });
    return NextResponse.json(updatedAdmin);
  } 
}
  catch (error) {
    console.error('Error updating admin user:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE request to delete a specific admin user by ID
export async function DELETE(request, { params }) {
  try {
    const id = parseInt(params.id);
    await prisma.adminUser.delete({ where: { id } });
    return NextResponse.json({ message: 'Admin deleted successfully' });
  } catch (error) {
    console.error('Error deleting admin user:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
