import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "pages/api/auth/[...nextauth]";
import { USERTYPE } from "middleware";
import prisma from "lib/prisma";

export async function DELETE(request: NextRequest, context: { params: any }) {
  try {
    if (request.method === "DELETE") {
      const session = await getServerSession(authOptions);
      if (session?.user.role !== USERTYPE.ADMIN) {
        return NextResponse.json("Unauthorized Request", { status: 401 });
      }

      const { id } = context.params;
      const deletedProduct = await prisma.product.delete({
        where: { id: Number(id) },
      });

      return NextResponse.json(`Product: ${deletedProduct.name} was deleted.`, {
        status: 200,
      });
    } else {
      return NextResponse.json("Route no valid", { status: 500 });
    }
  } catch (error: any) {
    return NextResponse.json(error.message, { status: 500 });
  }
}
