import prisma from "lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest, context: { params: any }) {
  try {
    if (request.method === "GET") {
      const { id } = context.params;
      console.log(request.url);

      const product = await prisma!.product.findUnique({
        where: { id: Number(id) },
        include: { categories: true, images: true },
      });

      return NextResponse.json(product, { status: 200 });
    } else {
      return NextResponse.json("Route no valid", { status: 500 });
    }
  } catch (error: any) {
    return NextResponse.json(error.message, { status: 500 });
  }
}
