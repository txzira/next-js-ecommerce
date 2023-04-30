import prisma from "lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  if (request.method === "POST") {
    const { cartItemId, quantity, oldQuantity } = await request.json();
    const quantityDifference = quantity - oldQuantity;
    const cartItem = await prisma.cartItem.update({ where: { id: cartItemId }, data: { quantity } });
    console.log(quantityDifference * cartItem.price);
    await prisma.cart.update({
      where: { id: cartItem.cartId },
      data: { cartTotal: { increment: quantityDifference * cartItem.price } },
    });
    return NextResponse.json({ message: "Quantity updated successfully", status: 200 });
  } else {
    return NextResponse.json({ message: "Route no valid", status: 500 });
  }
}
