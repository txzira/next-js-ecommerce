import prisma from "lib/prisma";
import { USERTYPE } from "middleware";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "pages/api/auth/[...nextauth]";

export async function GET(request: NextRequest) {
  try {
    if (request.method === "GET") {
      console.log(request.url);
      // If user not admin throw error
      const session = await getServerSession(authOptions);
      if (session.user.role !== USERTYPE.ADMIN) {
        return NextResponse.json("Unauthorized Request", { status: 401 });
      }

      const cryptoWallets = await prisma.cryptoWallet.findMany({ include: { type: true } });
      return NextResponse.json(cryptoWallets, { status: 200 });
    } else {
      return NextResponse.json("Route no valid", { status: 500 });
    }
  } catch (error) {
    return NextResponse.json(error.message, { status: 400 });
  }
}
