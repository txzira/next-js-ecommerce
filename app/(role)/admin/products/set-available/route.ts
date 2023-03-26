import prisma from "lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  if (request.method === "POST") {
    const { id, active } = await request.json();
    console.log(id);
    await prisma.product.update({
      where: { id },
      data: {
        active,
      },
    });
    return NextResponse.json({ message: `Product successfully set to ${active ? "available" : "unavailable"}`, status: 200 });
  } else {
    return NextResponse.json({ message: "Route no valid", status: 500 });
  }
}
