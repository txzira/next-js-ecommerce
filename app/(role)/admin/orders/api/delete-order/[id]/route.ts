import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "pages/api/auth/[...nextauth]";
import { USERTYPE } from "middleware";
import prisma from "lib/prisma";

export async function DELETE(request: NextRequest, context: { params }) {
  try {
    if (request.method === "DELETE") {
      const session = await getServerSession(authOptions);
      if (session.user.role !== USERTYPE.ADMIN) {
        return NextResponse.json("Unauthorized Request", { status: 401 });
      }
      const { id } = context.params;
      await prisma.order.delete({ where: { id: Number(id) } });
      return NextResponse.json("Order was deleted successfully.", { status: 200 });
    } else {
      return NextResponse.json("Route not valid.", { status: 500 });
    }
  } catch (error) {
    return NextResponse.json(error.message, { status: 400 });
  }
}
