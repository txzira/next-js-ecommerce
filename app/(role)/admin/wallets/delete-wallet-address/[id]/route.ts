import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "pages/api/auth/[...nextauth]";
import { USERTYPE } from "middleware";
import prisma from "lib/prisma";

export async function DELETE(request: NextRequest, context: { params }) {
  if (request.method === "DELETE") {
    try {
      const { id } = context.params;
      const session = await getServerSession(authOptions);
      if (session.user.role !== USERTYPE.ADMIN) {
        throw new Error("Unauthorized Request");
      }
      const deletedWalletAddress = await prisma.walletAddress.delete({ where: { id: Number(id) } });
      return NextResponse.json({ message: `Wallet Address: ${deletedWalletAddress.address} was deleted.`, status: 200 });
    } catch (error) {
      throw error;
    }
  } else {
    return NextResponse.json({ message: "Route no valid", status: 500 });
  }
}
