import prisma from "lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest, context: { params }) {
  try {
    if (request.method === "GET") {
      const { id } = context.params;
      console.log(request.url);

      const attributeGroups = await prisma.attributeGroup.findMany({
        where: { productId: Number(id) },
        include: { attributes: { include: { images: true } } },
      });
      // console.log(attributeGroups);
      return NextResponse.json(attributeGroups, { status: 200 });
    } else {
      return NextResponse.json("Route no valid", { status: 500 });
    }
  } catch (error) {
    return NextResponse.json(error.message, { status: 500 });
  }
}
