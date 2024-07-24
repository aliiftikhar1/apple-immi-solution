import { NextResponse } from 'next/server';
import prisma from '../../util/prisma';

export async function POST(request) {
  try {
    // Check if the content type is application/json
    if (!request.headers.get('content-type')?.includes('application/json')) {
      console.error('Error: Expected Content-Type: application/json');
      return NextResponse.json(
        {
          message: 'Incorrect content type, expected application/json',
          status: false,
        },
        { status: 400 }
      );
    }

    const data = await request.json();
    console.log('Received data:', data);  // Log the received data for debugging

    if (Object.keys(data).length === 0) {
      console.error('Error: No data received');
      return NextResponse.json(
        {
          message: 'No data received',
          status: false,
        },
        { status: 400 }
      );
    }

    //---------------------Image Upload-----------------------------

    const { Email, images } = data;

    if (!images || images.length === 0) {
      throw new Error('No images provided');
    }

    const uploadedImages = await Promise.all(images.map(async (img) => {
      const response = await fetch('https://admin.applelegal.co/uploadImage.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: img.base64 }),
      });
      const result = await response.json();
      if (response.ok) {
        return {
          user: Email,
          imgurl: result.image_url,
          type: img.type,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      } else {
        throw new Error(result.error || 'Failed to upload image');
      }
    }));

    const createdImages = await Promise.all(uploadedImages.map(async (image) => {
      return await prisma.images.create({
        data: image,
      });
    }));



    //--------------------------------------------------
    // Destructure the received data
    const { id, Visa_Type, Visa_Country, addedby,Note, status, Full_Name, imgurl, base64, Passport_No, CNIC_No, Father_Name, Nationality, City, Address, Phone_No1, Phone_No2, Gender, Age,  Interested_Country, Educational_Activity, List_degree_completed, Marital_Status, NTN_No, Employment_Status, Parents_CNIC_No, Uploaded_Files, Birth_Place } = data;

    // Upload the image and get the URL
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

      // Create the new customer record
      const newCustomer = await prisma.customer.create({
        data: {
          Visa_Type,
          Visa_Country,
          addedby,
          status,
          Full_Name,
          imgurl: result.image_url,
          Passport_No,
          Note,
          CNIC_No,
          Father_Name,
          Nationality,
          City,
          Address,
          Phone_No1,
          Phone_No2,
          Gender,
          Age,
          Email,
          Interested_Country,
          Educational_Activity,
          List_degree_completed,
          Marital_Status,
          NTN_No,
          Employment_Status,
          Parents_CNIC_No,
          Uploaded_Files,
          Birth_Place,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      return NextResponse.json(newCustomer);
    } else {
      throw new Error('Failed to upload image');
    }
  } catch (error) {
    console.error('Error creating customer:', error);
    return NextResponse.json(
      {
        message: 'Failed to create customer',
        status: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const customers = await prisma.customer.findMany();
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
