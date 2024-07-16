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
      if (session?.user.role !== USERTYPE.ADMIN) {
        return NextResponse.json("Unauthorized Request", { status: 401 });
      }

      const { id, verify } = await request.json();
      const user = await prisma.user.update({
        where: { id: Number(id) },
        data: { verifiedByAdmin: !verify },
      });
      return NextResponse.json(
        `User was ${user.verifiedByAdmin ? "Verified" : "Unverified"}.`,
        { status: 200 }
      );
    } else {
      return NextResponse.json("Route no valid", { status: 500 });
    }
  } catch (error: any) {
    return NextResponse.json(error.message, { status: 400 });
  }
}
