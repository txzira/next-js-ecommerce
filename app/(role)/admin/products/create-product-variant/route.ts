import prisma from "lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  if (request.method === "POST") {
    try {
      const { id, variant } = await request.json();
      const productVariant = await prisma.productVariant.create({
        data: { name: variant.variantName, price: variant.variantPrice, product: { connect: { id } } },
      });
      console.log(productVariant);
      return NextResponse.json({
        message: `Product variant  ${productVariant.name} successfully added.`,
        status: 200,
      });
    } catch (error) {
      console.log(error);
    }
  } else {
    return NextResponse.json({ message: "Route no valid", status: 500 });
  }
}
