// import { NextResponse } from 'next/server';
// import prisma from '../../../util/prisma';

// export async function GET(request, { params }) {
//     try {
//       const userId = parseInt(params.id, 10);
  
//       if (!userId) {
//         return NextResponse.json(
//           {
//             message: 'User ID is required',
//             status: false,
//           },
//           { status: 400 }
//         );
//       }
  
//       // Fetch branch ID using userId
//       const branchid = await prisma.$queryRaw`SELECT * FROM AdminUser WHERE id = ${userId}`;
//       if (branchid.length === 0) {
//         return NextResponse.json(
//           {
//             message: 'User not found',
//             status: false,
//           },
//           { status: 404 }
//         );
//       }
  
//       const bcode = branchid[0].branch;
  
//       // Fetch customers based on branch and country
//       const customer = await prisma.$queryRaw`
//         SELECT Customer.*, AdminUser.branch, AdminUser.id, AdminUser.imgurl as imageurl
//         FROM Customer
//         INNER JOIN AdminUser ON Customer.addedby = AdminUser.id
//         WHERE AdminUser.branch = ${bcode}
//       `;
  
//       // Fetch images
//       const images = await prisma.images.findMany();
  
//       return NextResponse.json({ customer, images });
//     } catch (error) {
//       console.error('Error fetching customer:', error);
//       return NextResponse.json(
//         {
//           message: 'Failed to fetch customer',
//           status: false,
//           error: error.message,
//         },
//         { status: 500 }
//       );
//     }
//   }