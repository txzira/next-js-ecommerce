import prisma from "lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  if (request.method === "POST") {
    const { formProduct } = await request.json();
    console.log(formProduct);
    const product = await prisma.product.update({
      where: { id: formProduct.id },
      data: {
        name: formProduct.name,
        price: formProduct.price,
      },
    });
    console.log(product);
    return NextResponse.json({ message: "Product updated successfully", status: 200 });
  } else {
    return NextResponse.json({ message: "Route no valid", status: 500 });
  }
}
