import prisma from "lib/prisma";
import { USERTYPE } from "middleware";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "pages/api/auth/[...nextauth]";

export async function POST(request: NextRequest) {
  try {
    if (request.method === "POST") {
      // If user not admin throw error
      const session = await getServerSession(authOptions);
      if (session.user.role !== USERTYPE.ADMIN) {
        throw new Error("Unauthorized Request");
      }

      const { cryptoWalletAddress: address, cryptoWalletTypeId: id } = await request.json();
      const cryptoWallet = await prisma.cryptoWallet.create({ data: { address, type: { connect: { id } } } });

      return NextResponse.json({ message: `Successfully added "${cryptoWallet.address}" to list of wallets.`, status: 200 });
    } else {
      return NextResponse.json({ message: "Route no valid", status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ message: error.message, status: 400 });
  }
}