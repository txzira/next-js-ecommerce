import { ProductVariant } from "@prisma/client";
import prisma from "lib/prisma";
import { USERTYPE } from "middleware";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "pages/api/auth/[...nextauth]";

export async function PUT(request: NextRequest) {
  try {
    if (request.method === "PUT") {
      const session = await getServerSession(authOptions);
      if (session.user.role !== USERTYPE.ADMIN) {
        return NextResponse.json("Unauthorized Request", { status: 401 });
      }

      const {
        details,
      }: {
        details: ProductVariant;
      } = await request.json();
      const productVariant = await prisma.productVariant.update({
        where: { id: details.id },
        data: details,
      });
      return NextResponse.json(`Variant updated successfully.`, {
        status: 200,
      });
    } else {
      return NextResponse.json("Route not valid.", { status: 500 });
    }
  } catch (error) {
    return NextResponse.json(error.message, { status: 400 });
  }
}
