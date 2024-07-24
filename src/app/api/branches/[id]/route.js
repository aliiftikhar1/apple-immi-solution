


import { NextResponse } from "next/server";
import prisma from "../../../util/prisma";

export async function GET (request ,{param}){
  try {
    const id = parseInt(param.id);
    const getbranches = await prisma.Branches.findUnique({
      where: {
        id: id,
        },
        });
        return NextResponse.json(getbranches);
        } catch (error) {
          console.log("Error Creating branches :", error);
          return NextResponse.error("Internal Server Error", 500);
          }
          

}
export async function PUT(request, { params }) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();
    const { title, address, city } = body;
    const updatedBranch = await prisma.Branches.update({
      where: { id },
      data: {
        title,
        address,
        city,
        updatedAt: new Date(),
      },
    });
    return new Response(JSON.stringify(updatedBranch), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error("Error updating branch:", error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}



export async function DELETE(request, { params }) {
  try {
    const id = parseInt(params.id);
    const deletedBranches = await prisma.Branches.delete({
      where: {
        id: id,
      },
    });
    return NextResponse.json(deletedBranches);
  } catch (error) {
    console.error('Error deleting branches:', error);
    return NextResponse.json(
      {
        message: 'Failed to delete branch',
        status: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
