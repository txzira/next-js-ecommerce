import { NextRequest, NextResponse } from "next/server";
import { uploadImage } from "lib/cloudinary";
import prisma from "lib/prisma";

export async function POST(request: NextRequest) {
  if (request.method === "POST") {
    const { name, price, productType } = await request.json();
    console.log(productType);
    try {
      const product = await prisma.product.create({
        data: { name: name, price: Number(price), productCategoryId: Number(productType) },
      });

      return NextResponse.json({ message: `Added product '${product.name}' successfully!`, status: 200 });
    } catch (error) {
      if (error.code === "P2002") {
        return NextResponse.json({ message: " Product already exist", status: 400 });
      }
    }
  } else {
    return NextResponse.json({ message: "Route not valid.", status: 500 });
  }
}
