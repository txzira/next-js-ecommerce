import prisma from "lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "pages/api/auth/[...nextauth]";

export async function POST(request: NextRequest) {
  if (request.method === "POST") {
    // const session = await getServerSession(authOptions);
    const {
      cartId,
      shipping,
    }: {
      cartId: number;
      shipping: {
        firstName: string;
        lastName: string;
        streetAddress: string;
        streetAddress2: string;
        city: string;
        state: string;
        zipCode: string;
      };
    } = await request.json();
    console.log(cartId, shipping);
    for (const key in shipping) {
      console.log(key);
      if (!shipping[key] && key !== "streetAddress2")
        return NextResponse.json({ message: "Invalid shipping information from user.", status: 400 });
    }
    //get cart information server side
    const cart = await prisma.cart.findFirst({ where: { id: cartId } });
    //create order
    const order = await prisma.order.create({
      data: {
        customer: { connect: { id: cart.userId } },
        cart: { connect: { id: cart.id } },
        amount: cart.cartTotal,
        shipping: { create: shipping },
      },
    });
    //disable current cart
    await prisma.cart.update({ where: { id: cart.id }, data: { currentCart: { set: false } } });
    //create new empty cart
    await prisma.cart.create({ data: { cartTotal: 0, userId: cart.userId } });
    return NextResponse.json({ status: 200 });
  } else {
    return NextResponse.json({ message: "Route no valid", status: 500 });
  }
}
