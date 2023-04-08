import prisma from "lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest, context: { params }) {
  if (request.method === "GET") {
    const category = context.params.category;
    let products;
    if (category === "All") {
      products = await prisma.product.findMany({ include: { type: true } });
    } else {
      products = await prisma.product.findMany({ include: { type: true }, where: { type: { name: category } } });
    }
    return NextResponse.json({ products, status: 200 });
  } else {
    return NextResponse.json({ message: "Route no valid", status: 500 });
  }
}
