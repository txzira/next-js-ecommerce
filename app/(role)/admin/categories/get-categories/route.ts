import prisma from "lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  if (request.method === "GET") {
    const categories = await prisma.category.findMany({});
    return NextResponse.json({ categories, status: 200 });
  } else {
    return NextResponse.json({ message: "Route no valid", status: 500 });
  }
}
