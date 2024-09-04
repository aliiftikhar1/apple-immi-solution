import { NextResponse } from 'next/server';
import prisma from '../../../util/prisma';

export async function GET(request, { params }) {
  try {
    const employeeId = parseInt(params.id);

    // Raw query to count customers and get customer IDs added by admin users with role 'employee'
    const customerCounts = await prisma.$queryRaw`
      SELECT 
        a.id AS adminUserId, 
        COUNT(c.id) AS customerCount, 
        GROUP_CONCAT(c.id) AS customerIds
      FROM 
        AdminUser a 
      LEFT JOIN 
        Customer c 
      ON 
        a.id = c.addedby 
      WHERE 
        a.id = ${employeeId}
      GROUP BY 
        a.id;
    `;

    // Convert BigInt values to Number and customerIds to array of numbers
    const formattedCounts = customerCounts.map(item => ({
      adminUserId: Number(item.adminUserId),
      customerCount: Number(item.customerCount),
      customers: item.customerIds ? item.customerIds.split(',').map(id => Number(id)) : []
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
