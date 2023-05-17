import { Cart, CartItem, Order, ShippingAddress } from "@prisma/client";
import prisma from "lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, context: { params }) {
  if (request.method === "GET") {
    const limit = Number(context.params.limit);
    const cursor = Number(context.params.cursor);
    const sort = context.params.sort;

    let orders: (Order & {
      customer: {
        firstName: string;
        lastName: string;
        email: string;
      };
      cart: Cart & {
        cartItems: CartItem[];
      };
      shipping: ShippingAddress;
      image: {
        url: string;
      };
    })[];
    const count = await prisma.order.count();

    if (cursor === 0) {
      orders = await prisma.order.findMany({
        include: {
          customer: { select: { firstName: true, lastName: true, email: true } },
          image: { select: { url: true } },
          cart: { include: { cartItems: true } },
          shipping: true,
        },
        take: limit,
        orderBy: { id: sort },
      });
    } else {
      orders = await prisma.order.findMany({
        include: {
          customer: { select: { firstName: true, lastName: true, email: true } },
          image: { select: { url: true } },
          cart: { include: { cartItems: true } },
          shipping: true,
        },
        take: limit,
        skip: 1,
        cursor: { id: cursor },
        orderBy: { id: sort },
      });
    }
    return NextResponse.json({ orders, count, status: 200 });
  } else {
    return NextResponse.json({ message: "Route no valid", status: 500 });
  }
}
