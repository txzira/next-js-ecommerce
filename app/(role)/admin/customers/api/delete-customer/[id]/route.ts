import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "pages/api/auth/[...nextauth]";
import { USERTYPE } from "middleware";
import prisma from "lib/prisma";

export async function DELETE(request: NextRequest, context: { params }) {
  try {
    if (request.method === "DELETE") {
      // If user not admin throw error
      const session = await getServerSession(authOptions);
      if (session.user.role !== USERTYPE.ADMIN) {
        return NextResponse.json("Unauthorized Request", { status: 401 });
      }

      const { id } = context.params;
      const deleteCustomer = await prisma.user.delete({ where: { id: Number(id) } });
      return NextResponse.json(`User: ${deleteCustomer.firstName + " " + deleteCustomer.lastName} was deleted.`, { status: 200 });
    } else {
      return NextResponse.json("Route no valid", { status: 500 });
    }
  } catch (error) {
    return NextResponse.json(error.message, { status: 400 });
  }
}
