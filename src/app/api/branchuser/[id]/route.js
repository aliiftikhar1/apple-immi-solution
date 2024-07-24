import { NextResponse } from 'next/server';
import prisma from '../../../util/prisma';

export async function GET(request, { params }) {
  try {
    const id = parseInt(params.id);
    const images = await prisma.images.findMany();
    const branchid = await prisma.$queryRaw`select * FROM AdminUser where id = ${id} `;
    let bcode =  branchid[0].branch;


    const customer = await prisma.$queryRaw`select Customer.*,AdminUser.branch,AdminUser.id,AdminUser.imgurl as imageurl  from Customer inner join AdminUser on Customer.addedby  = AdminUser.id where  AdminUser.branch = ${bcode} `;
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