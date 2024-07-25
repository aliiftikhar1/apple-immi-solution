import { NextResponse } from 'next/server';
import prisma from '../../../util/prisma'; // Adjust the import path as needed

export async function GET(request, { params }) {
  const  country  = params.id;
console.log(country)
  try {
    const customers = await prisma.$queryRaw`
           SELECT * FROM Customer WHERE Visa_Country = ${country}`
         ;
    return NextResponse.json(customers, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
