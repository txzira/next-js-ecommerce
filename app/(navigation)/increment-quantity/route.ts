import prisma from "lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  if (request.method === "POST") {
    const { cartId, itemId } = await request.json();

    console.log(itemId);

    const cartItem = await prisma!.cartItem.update({
      where: { id: itemId },
      data: { quantity: { increment: 1 } },
    });
    await prisma!.cart.update({
      where: { id: cartId },
      data: { cartTotal: { increment: cartItem.price } },
    });

    return NextResponse.json({ status: 200 });
  } else {
    return NextResponse.json({ message: "Route no valid", status: 500 });
  }
}
