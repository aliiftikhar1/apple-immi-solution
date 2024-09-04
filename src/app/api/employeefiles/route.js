import { NextResponse } from 'next/server';
import prisma from '../../util/prisma';

export async function GET() {
  try {
    // Raw query to count customers added by admin users with role 'employee'
    const customerCounts = await prisma.$queryRaw`
      SELECT 
        a.id AS adminUserId, 
        COUNT(c.id) AS customerCount 
      FROM 
        AdminUser a 
      LEFT JOIN 
        Customer c 
      ON 
        a.id = c.addedby 
      WHERE 
        a.role = 'employee'
      GROUP BY 
        a.id;
    `;

    // Convert BigInt values to Number
    const formattedCounts = customerCounts.map(item => ({
      adminUserId: Number(item.adminUserId),
      customerCount: Number(item.customerCount)
    }));

    return NextResponse.json(formattedCounts);
  } catch (error) {
    console.error('Error fetching customer counts:', error);
    return NextResponse.json(
      {
        message: 'Failed to fetch customer counts',
        status: false,
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}
