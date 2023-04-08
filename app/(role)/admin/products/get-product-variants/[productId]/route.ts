import prisma from "lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, context: { params }) {
  if (request.method === "GET") {
    const { productId } = context.params;
    const productVariants = await prisma.productVariant.findMany({ where: { productId: Number(productId) } });
    return NextResponse.json({ productVariants, status: 200 });
  } else {
    return NextResponse.json({ message: "Route no valid", status: 500 });
  }
}
