import prisma from "lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "pages/api/auth/[...nextauth]";

export async function GET(request: NextRequest) {
  if (request.method === "GET") {
    const session = await getServerSession(authOptions);
    if (session) {
      const cart = await prisma!.cart.findFirst({
        where: { userId: session.user.id, currentCart: true },
        include: { cartItems: true },
      });
      return NextResponse.json({ cart, status: 200 });
    } else {
      return NextResponse.json({ message: "Not Authorized", status: 401 });
    }
  } else {
    return NextResponse.json({ message: "Route no valid", status: 500 });
  }
}
