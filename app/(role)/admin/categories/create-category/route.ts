import prisma from "lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  if (request.method === "POST") {
    try {
      const { categoryName } = await request.json();
      const category = await prisma.category.create({ data: { name: categoryName } });
      return NextResponse.json({ message: `Product category ${category.name} successfully added.`, status: 200 });
    } catch (error) {
      if (error.code === "P2002") return NextResponse.json({ message: `Product category already exist.`, status: 400 });
      return NextResponse.json({ message: error.message, status: 400 });
    }
  } else {
    return NextResponse.json({ message: "Route no valid", status: 500 });
  }
}
