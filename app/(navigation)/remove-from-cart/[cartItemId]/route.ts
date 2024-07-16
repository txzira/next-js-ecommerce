import prisma from "lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "pages/api/auth/[...nextauth]";

export async function DELETE(request: NextRequest, context: { params: any }) {
  if (request.method === "DELETE") {
    const { cartItemId } = context.params;
    const session = await getServerSession(authOptions);
    if (session) {
      const cartItem = await prisma.cartItem.delete({
        where: { id: Number(cartItemId) },
      });
      await prisma.cart.update({
        where: { id: cartItem.cartId },
        data: { cartTotal: { decrement: cartItem.quantity * cartItem.price } },
      });
      return NextResponse.json({
        message: `${cartItem.productName} removed from cart.`,
        status: 200,
      });
    } else {
      return NextResponse.json({ message: "Not Authorized", status: 401 });
    }
  } else {
    return NextResponse.json({ message: "Route no valid", status: 500 });
  }
}
