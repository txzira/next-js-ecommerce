import prisma from "lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  if (request.method === "GET") {
    const walletTypes = await prisma.walletType.findMany({});

    return NextResponse.json({ walletTypes, status: 200 });
  } else {
    return NextResponse.json({ message: "Route no valid", status: 500 });
  }
}
