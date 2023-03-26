import prisma from "lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, context: { params }) {
  if (request.method === "GET") {
    const page = Number(context.params.page);
    const limit = Number(context.params.limit);
    const sort = context.params.sort;

    const orders = await prisma.order.findMany({
      include: {
        customer: { select: { firstName: true, lastName: true, email: true } },
        image: { select: { url: true } },
        products: { select: { quantity: true, product: { select: { name: true, price: true } } } },
      },
      take: limit,
      ...(page === 0 && { skip: 0 }),
      ...(page !== 0 && { skip: 1 }),
      // ...(cursorId && { cursor: { id: cursorId } }),
      orderBy: { id: sort },
    });
    console.log(orders);
    return NextResponse.json({ orders, status: 200 });
  } else {
    return NextResponse.json({ message: "Route no valid", status: 500 });
  }
}
