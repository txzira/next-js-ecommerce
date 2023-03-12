import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "pages/api/auth/[...nextauth]";
import { USERTYPE } from "middleware";
import prisma from "lib/prisma";

export async function DELETE(request: NextRequest, context: { params }) {
  if (request.method === "DELETE") {
    try {
      const { id } = context.params;

      const session = await getServerSession(authOptions);
      if (session.user.role !== USERTYPE.ADMIN) {
        throw new Error("Unauthorized Request");
      }
      const deleteCustomer = await prisma.user.delete({ where: { id: Number(id) } });
      console.log(id);
      console.log(deleteCustomer);
      return NextResponse.json({ message: `User: ${deleteCustomer.firstName + " " + deleteCustomer.lastName} was deleted.`, status: 200 });
    } catch (error) {
      throw error;
    }
  }
}
