import { Order, orderProduct, Product, Image, ShippingAddress } from "@prisma/client";
import prisma from "lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "pages/api/auth/[...nextauth]";

export async function GET(request: NextRequest, context: { params }) {
  if (request.method === "GET") {
    const session = await getServerSession(authOptions);
    const limit = Number(context.params.limit);
    const cursor = Number(context.params.cursor);
    const sort = context.params.sort;
    const count = await prisma.order.count({ where: { customerId: session.user.id } });
    let userOrders: (Order & {
      image: Image;
      products: (orderProduct & {
        product: Product;
      })[];
      shipping: ShippingAddress;
    })[];
    if (cursor === 0) {
      userOrders = await prisma.order.findMany({
        where: { customerId: session.user.id },
        take: limit,
        orderBy: { id: sort },
        include: { products: { include: { product: true } }, image: true, shipping: true },
      });
    } else {
      userOrders = await prisma.order.findMany({
        where: { customerId: session.user.id },
        take: limit,
        skip: 1,
        cursor: { id: cursor },
        orderBy: { id: sort },
        include: { products: { include: { product: true } }, image: true, shipping: true },
      });
    }
    return NextResponse.json({ userOrders, count, status: 200 });
  } else {
    return NextResponse.json({ message: "Route no valid", status: 500 });
  }
}
