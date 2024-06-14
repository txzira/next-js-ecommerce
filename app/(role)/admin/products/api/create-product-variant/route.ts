import prisma from "lib/prisma";
import { USERTYPE } from "middleware";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "pages/api/auth/[...nextauth]";

export async function POST(request: NextRequest) {
  try {
    if (request.method === "POST") {
      const session = await getServerSession(authOptions);
      if (session.user.role !== USERTYPE.ADMIN) {
        return NextResponse.json("Unauthorized Request", { status: 401 });
      }
      const { id, productVariant } = await request.json();
      const createdProductVariant = await prisma.productVariant.create({
        data: { name: productVariant.name, price: productVariant.price, product: { connect: { id } } },
      });
      return NextResponse.json(`Product variant  ${createdProductVariant.name} successfully added.`, { status: 201 });
    } else {
      return NextResponse.json("Route no valid", { status: 500 });
    }
  } catch (error) {
    return NextResponse.json(error.message, { status: 500 });
  }
}
