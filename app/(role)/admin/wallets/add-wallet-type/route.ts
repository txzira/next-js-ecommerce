import prisma from "lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  if (request.method === "POST") {
    const { walletType } = await request.json();
    console.log(walletType);
    const walletAddress = await prisma.walletType.create({ data: { name: walletType } });

    return NextResponse.json({ message: `Successfully added "${walletAddress.name}" to wallet types.`, status: 200 });
  } else {
    return NextResponse.json({ message: "Route no valid", status: 500 });
  }
}
