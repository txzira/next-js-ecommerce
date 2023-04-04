import { Order, ShippingAddress } from "@prisma/client";
import prisma from "lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, context: { params }) {
  if (request.method === "GET") {
    const limit = Number(context.params.limit);
    const cursor = Number(context.params.cursor);
    const sort = context.params.sort;

    let orders: (Order & {
      products: {
        quantity: number;
        product: {
          name: string;
          price: number;
        };
      }[];
      customer: {
        email: string;
        firstName: string;
        lastName: string;
      };
      image: {
        url: string;
      };
      shipping: ShippingAddress;
    })[];
    const count = await prisma.order.count();
    if (cursor === 0) {
      orders = await prisma.order.findMany({
        include: {
          customer: { select: { firstName: true, lastName: true, email: true } },
          image: { select: { url: true } },
          products: { select: { quantity: true, product: { select: { name: true, price: true } } } },
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
          products: { select: { quantity: true, product: { select: { name: true, price: true } } } },
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
