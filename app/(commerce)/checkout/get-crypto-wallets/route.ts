import prisma from "lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  if (request.method === "GET") {
    const cryptoWallets = await prisma.cryptoWallet.findMany({ where: { active: true }, include: { type: true } });

    return NextResponse.json({ cryptoWallets, status: 200 });
  } else {
    return NextResponse.json({ message: "Route no valid", status: 500 });
  }
}
