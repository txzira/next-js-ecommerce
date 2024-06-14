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
        return NextResponse.json("Unauthorized Request", { status: 401 });
      }

      const { formWallet } = await request.json();
      const cryptoWallet = await prisma.cryptoWallet.update({
        where: { id: formWallet.id },
        data: {
          address: formWallet.address,
          active: formWallet.active,
          type: { connect: { id: Number(formWallet.typeId) } },
        },
      });

      return NextResponse.json(`Successfully updated address, "${cryptoWallet.address}".`, { status: 200 });
    } else {
      return NextResponse.json("Route no valid", { status: 500 });
    }
  } catch (error) {
    return NextResponse.json(error.message, { status: 400 });
  }
}
