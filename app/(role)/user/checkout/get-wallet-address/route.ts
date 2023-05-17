import prisma from "lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  if (request.method === "GET") {
    const walletAddresses = await prisma.walletAddress.findMany({ where: { active: true }, include: { type: true } });

    return NextResponse.json({ walletAddresses, status: 200 });
  } else {
    return NextResponse.json({ message: "Route no valid", status: 500 });
  }
}
