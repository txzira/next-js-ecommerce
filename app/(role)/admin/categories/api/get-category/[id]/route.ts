import prisma from "lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest, context: { params: any }) {
  try {
    if (request.method === "GET") {
      const { id } = context.params;
      console.log(request.url);
      const category = await prisma.category.findUnique({
        where: { id: Number(id) },
        include: { children: { include: { children: true } }, parent: true },
      });
      return NextResponse.json(category, { status: 200 });
    } else {
      return NextResponse.json({ message: "Route no valid", status: 500 });
    }
  } catch (error: any) {
    return NextResponse.json(error.message, { status: 400 });
  }
}
