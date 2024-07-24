import { NextResponse } from 'next/server';
import prisma from '../../../util/prisma';

export async function GET(request, { params }) {
  try {
    const id = parseInt(params.id);
    const images = await prisma.images.findMany();
    const customer = await prisma.customer.findUnique({
      where: {
        id: id,
      },
    });
    return NextResponse.json(customer,images);
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

export async function PUT(request, { params }) {
  try {
    const id = parseInt(params.id);
    const data = await request.json();
    
       //---------------------Image Upload-----------------------------

       const { Email, images } = data;

    //    if (!images || images.length === 0) {
    //      throw new Error('No images provided');
    //    }
   
    //    const uploadedImages = await Promise.all(images.map(async (img) => {
    //      const response = await fetch('https://admin.applelegal.co/uploadImage.php', {
    //        method: 'POST',
    //        headers: {
    //          'Content-Type': 'application/json',
    //        },
    //        body: JSON.stringify({ image: img.base64 }),
    //      });
    //      const result = await response.json();
    //      if (response.ok) {
    //        return {
    //          user: Email,
    //          imgurl: result.image_url,
    //          type: img.type,
    //          createdAt: new Date(),
    //          updatedAt: new Date(),
    //        };
    //      } else {
    //        throw new Error(result.error || 'Failed to upload image');
    //      }
    //    }));
   

       
    //    const createdImages = await Promise.all(uploadedImages.map(async (image) => {
    //     const updateQuery = `
    //   UPDATE images
    //   SET imgurl = '${image.imgurl}', updatedAt = NOW()
    //   WHERE user = '${Email}' AND type = '${image.type}'
    // `;
    // // Execute the raw SQL query
    // await prisma.$executeRawUnsafe(updateQuery);
    //     //  return await prisma.images.update({
    //     //   where: { user: Email, type: image.type },
    //     //    data: image,
    //     //  });
    //    }));
   
       //--------------------------------------------------

    const {Visa_Type, Visa_Country,status,addedby,Note, Full_Name, imgurl,base64, Passport_No, CNIC_No, Father_Name, Nationality, City, Address, Phone_No1, Phone_No2, Gender, Age, Interested_Country, Educational_Activity, List_degree_completed, Marital_Status, NTN_No, Employment_Status, Parents_CNIC_No, Uploaded_Files, Birth_Place  } = data;
    
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
  

      const updateCustomerQuery = `
      UPDATE Customer
      SET 
        Visa_Type = '${Visa_Type}',
        Visa_Country = '${Visa_Country}',
        status = '${status}',
        Note = '${Note}',
        Full_Name = '${Full_Name}',
        imgurl = '${result.image_url}',
        Passport_No = '${Passport_No}',
        CNIC_No = '${CNIC_No}',
        Father_Name = '${Father_Name}',
        Nationality = '${Nationality}',
        City = '${City}',
        Address = '${Address}',
        Phone_No1 = '${Phone_No1}',
        Phone_No2 = '${Phone_No2}',
        Gender = '${Gender}',
        Age = ${Age},
        Email = '${Email}',
        Interested_Country = '${Interested_Country}',
        Educational_Activity = '${Educational_Activity}',
        List_degree_completed = '${List_degree_completed}',
        Marital_Status = '${Marital_Status}',
        NTN_No = '${NTN_No}',
        Employment_Status = '${Employment_Status}',
        Parents_CNIC_No = '${Parents_CNIC_No}',
        Uploaded_Files = '${Uploaded_Files}',
        Birth_Place = '${Birth_Place}',
        updatedAt = NOW()
      WHERE 
        Email = '${Email}'
    `;
    
    // Execute the raw SQL query
    const updatedCustomer = await prisma.$executeRawUnsafe(updateCustomerQuery);
    
    return NextResponse.json(updatedCustomer);
  } }catch (error) {
    console.error('Error updating customer:', error);
    return NextResponse.json(
      {
        message: 'Failed to update customer',
        status: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const id = parseInt(params.id);
    const deletedCustomer = await prisma.Customer.delete({
      where: {
        id: id,
      },
    });
    return NextResponse.json(deletedCustomer);
  } catch (error) {
    console.error('Error deleting customer:', error);
    return NextResponse.json(
      {
        message: 'Failed to delete customer',
        status: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
