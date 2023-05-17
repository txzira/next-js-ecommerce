import prisma from "lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest, context: { params }) {
  try {
    if (request.method === "DELETE") {
      const { id } = context.params;
      const pVariant = await prisma.productVariant.delete({ where: { id: Number(id) } });
      return NextResponse.json({ message: `Variant ${pVariant.name} deleted successfully.`, status: 200 });
    } else {
      return NextResponse.json({ message: "Route not valid.", status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ message: error.message, status: 400 });
  }
}
