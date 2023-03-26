import prisma from "lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  if (request.method === "POST") {
    const { walletAddress: address, walletTypeId: id } = await request.json();
    const wallet = await prisma.walletAddress.create({ data: { address, type: { connect: { id } } } });

    return NextResponse.json({ message: `Successfully added "${wallet.address}" to list of wallets.`, status: 200 });
  } else {
    return NextResponse.json({ message: "Route no valid", status: 500 });
  }
}
