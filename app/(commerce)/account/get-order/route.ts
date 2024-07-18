import prisma from "lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "pages/api/auth/[...nextauth]";

export async function GET(request: NextRequest, context: { params: any }) {
  const limit = Number(request.nextUrl.searchParams.get("limit"));
  const page = Number(request.nextUrl.searchParams.get("page"));
  try {
    if (request.method === "GET") {
      const session = await getServerSession(authOptions);
      const orders = await prisma!.order.findMany({
        where: { customerId: session?.user.id },
        include: {
          cart: {
            include: {
              cartItems: {
                include: {
                  variant: { select: { variantImages: true } },
                  product: { select: { images: { select: { url: true } } } },
                },
              },
            },
          },
          shippingAddress: true,
        },
        take: limit,
        skip: limit * page,
        orderBy: { date: "desc" },
      });
      return NextResponse.json({ orders }, { status: 200 });
    } else {
      return NextResponse.json({ message: "Route no valid" }, { status: 500 });
    }
  } catch (error) {
    console.log(error);
  }
}
