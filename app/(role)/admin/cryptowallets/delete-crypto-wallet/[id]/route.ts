import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "pages/api/auth/[...nextauth]";
import { USERTYPE } from "middleware";
import prisma from "lib/prisma";

export async function DELETE(request: NextRequest, context: { params }) {
  try {
    if (request.method === "DELETE") {
      const session = await getServerSession(authOptions);
      if (session.user.role !== USERTYPE.ADMIN) {
        throw new Error("Unauthorized Request");
      }
      const { id } = context.params;
      const deletedCryptoWallet = await prisma.cryptoWallet.delete({ where: { id: Number(id) } });
      return NextResponse.json({ message: `Wallet Address: ${deletedCryptoWallet.address} was deleted.`, status: 200 });
    } else {
      return NextResponse.json({ message: "Route no valid", status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ message: error.message, status: 400 });
  }
}
