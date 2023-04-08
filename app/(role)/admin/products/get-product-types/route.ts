import prisma from "lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  if (request.method === "GET") {
    const productTypes = await prisma.productType.findMany({});

    return NextResponse.json({ productTypes, status: 200 });
  } else {
    return NextResponse.json({ message: "Route no valid", status: 500 });
  }
}
