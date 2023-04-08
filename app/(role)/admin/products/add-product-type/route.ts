import prisma from "lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  if (request.method === "POST") {
    try {
      const { productTypeName } = await request.json();
      const productType = await prisma.productType.create({ data: { name: productTypeName } });
      return NextResponse.json({
        message: `Product type  ${productType.name} successfully added.`,
        status: 200,
      });
    } catch (error) {
      console.log(error);
    }
  } else {
    return NextResponse.json({ message: "Route no valid", status: 500 });
  }
}
