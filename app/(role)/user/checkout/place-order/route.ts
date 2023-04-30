import prisma from "lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "pages/api/auth/[...nextauth]";

export async function POST(request: NextRequest) {
  if (request.method === "POST") {
    // const session = await getServerSession(authOptions);
    // const { cartId } = await request.json();
    // const cart = await prisma.cart.findFirst({ where: { id: cartId } });

    // const order = await prisma.order.create({ data: { customerId: cart.userId, } });
    return NextResponse.json({ status: 200 });
  } else {
    return NextResponse.json({ message: "Route no valid", status: 500 });
  }
}
