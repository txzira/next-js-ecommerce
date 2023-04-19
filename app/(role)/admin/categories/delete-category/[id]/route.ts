import prisma from "lib/prisma";
import { USERTYPE } from "middleware";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "pages/api/auth/[...nextauth]";

export async function DELETE(request: NextRequest, context: { params }) {
  if (request.method === "DELETE") {
    try {
      const { id } = context.params;

      const session = await getServerSession(authOptions);
      if (session.user.role !== USERTYPE.ADMIN) {
        throw new Error("Unauthorized Request");
      }
      const deletedCategory = await prisma.category.delete({ where: { id: Number(id) } });
      return NextResponse.json({ message: `Category: ${deletedCategory.name} was deleted.`, status: 200 });
    } catch (error) {
      throw error;
    }
  }
}
