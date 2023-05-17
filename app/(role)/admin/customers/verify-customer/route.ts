import prisma from "lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  if (request.method === "POST") {
    const { id, verify } = await request.json();
    const user = await prisma.user.update({ where: { id: Number(id) }, data: { verifiedByAdmin: !verify } });
    return NextResponse.json({ message: `User was ${user.verifiedByAdmin ? "Verified" : "Unverified"}.` });
  } else {
    return NextResponse.json({ message: "Route no valid", status: 500 });
  }
}
