import prisma from "lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, context: { params }) {
  console.log(context);
  if (request.method === "GET") {
    const { id } = context.params;
    const userOrders = await prisma.order.findMany({
      where: { customerId: Number(id) },
      include: { products: { include: { product: true } } },
    });
    console.log(userOrders);
    return NextResponse.json({ userOrders, status: 200 });
  } else {
    return NextResponse.json({ message: "Route no valid", status: 500 });
  }
}
