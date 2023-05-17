import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "pages/api/auth/[...nextauth]";
import { USERTYPE } from "middleware";
import prisma from "lib/prisma";

export async function DELETE(request: NextRequest, context: { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (session.user.role !== USERTYPE.ADMIN) {
      throw new Error("Unauthorized Request");
    }
    if (request.method === "DELETE") {
      const { id } = context.params;
      await prisma.order.delete({ where: { id: Number(id) } });
      return NextResponse.json({ message: `Order was deleted successfully.`, status: 200 });
    } else {
      return NextResponse.json({ message: "Route not valid.", status: 500 });
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}
