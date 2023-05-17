import { ProductVariant } from "@prisma/client";
import prisma from "lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
  try {
    if (request.method === "PUT") {
      const {
        details,
      }: {
        details: ProductVariant;
      } = await request.json();
      const variant = await prisma.productVariant.update({ where: { id: details.id }, data: details });
      return NextResponse.json({ message: `Variant ${variant.name} updated successfully.`, status: 200 });
    } else {
      return NextResponse.json({ message: "Route not valid.", status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ message: error.message, status: 400 });
  }
}
