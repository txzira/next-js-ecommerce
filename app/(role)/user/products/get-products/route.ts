import prisma from "lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  if (request.method === "GET") {
    const products = await prisma.product.findMany({ where: { active: true }, include: { category: true, productVariants: true } });

    return NextResponse.json({ products, status: 200 });
  } else {
    return NextResponse.json({ message: "Route no valid", status: 500 });
  }
}
