import prisma from "lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  if (request.method === "POST") {
    const { cartId, itemId, quantity } = await request.json();
    console.log(itemId);
    if (quantity > 1) {
      const cartItem = await prisma.cartItem.update({ where: { id: itemId }, data: { quantity: { decrement: 1 } } });
      await prisma.cart.update({ where: { id: cartId }, data: { cartTotal: { decrement: cartItem.price } } });
    }
    return NextResponse.json({ status: 200 });
  } else {
    return NextResponse.json({ message: "Route no valid", status: 500 });
  }
}
