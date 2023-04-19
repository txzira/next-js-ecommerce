import prisma from "lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  if (request.method === "POST") {
    try {
      const { categoryName } = await request.json();
      const category = await prisma.category.create({ data: { name: categoryName } });
      return NextResponse.json({
        message: `Product type  ${category.name} successfully added.`,
        status: 200,
      });
    } catch (error) {
      console.log(error);
    }
  } else {
    return NextResponse.json({ message: "Route no valid", status: 500 });
  }
}
