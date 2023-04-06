import prisma from "lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  if (request.method === "POST") {
    const { formWallet } = await request.json();
    const walletAddress = await prisma.walletAddress.update({
      where: { id: formWallet.id },
      data: {
        address: formWallet.address,
        active: formWallet.active,
        type: { connect: { id: Number(formWallet.typeId) } },
      },
    });

    return NextResponse.json({ message: `Successfully updated address, "${walletAddress.address}".`, status: 200 });
  } else {
    return NextResponse.json({ message: "Route no valid", status: 500 });
  }
}
