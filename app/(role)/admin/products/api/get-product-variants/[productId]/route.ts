import prisma from "lib/prisma";
import { USERTYPE } from "middleware";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "pages/api/auth/[...nextauth]";

export async function GET(request: NextRequest, context: { params: any }) {
  if (request.method === "GET") {
    const session = await getServerSession(authOptions);
    if (session?.user.role !== USERTYPE.ADMIN) {
      return NextResponse.json("Unauthorized Request", { status: 401 });
    }

    const { productId } = context.params;
    const productVariants = await prisma!.productVariant.findMany({
      where: { productId: Number(productId) },
    });
    return NextResponse.json(productVariants, { status: 200 });
  } else {
    return NextResponse.json("Route no valid", { status: 500 });
  }
}
