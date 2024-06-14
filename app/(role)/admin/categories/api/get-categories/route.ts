import prisma from "lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    if (request.method === "GET") {
      console.log(request.url);
      const categories = await prisma.category.findMany({});
      return NextResponse.json(categories, { status: 200 });
    } else {
      return NextResponse.json({ message: "Route no valid", status: 500 });
    }
  } catch (error) {
    return NextResponse.json(error.message, { status: 400 });
  }
}
