import prisma from "lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  if (request.method === "GET") {
    const walletAddress = await prisma.walletAddress.findMany({ include: { type: true } });

    return NextResponse.json({ walletAddress, status: 200 });
  } else {
    return NextResponse.json({ message: "Route no valid", status: 500 });
  }
}
