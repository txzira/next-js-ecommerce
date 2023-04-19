import prisma from "lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  if (request.method === "POST") {
    const { categoryId, newCategoryName } = await request.json();
    const category = await prisma.category.update({
      where: { id: categoryId },
      data: {
        name: newCategoryName,
      },
    });
    return NextResponse.json({ message: "Category updated successfully", status: 200 });
  } else {
    return NextResponse.json({ message: "Route no valid", status: 500 });
  }
}
