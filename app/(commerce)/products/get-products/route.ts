import prisma from "lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    if (request.method === "GET") {
      console.log(request.url);
      const products = await prisma.product.findMany({
        where: { active: true },
        include: { categories: true, productVariants: true },
      });

      return NextResponse.json(products, { status: 200 });
    } else {
      return NextResponse.json("Route no valid", { status: 500 });
    }
  } catch (error: any) {
    return NextResponse.json(error.message, { status: 400 });
  }
}
