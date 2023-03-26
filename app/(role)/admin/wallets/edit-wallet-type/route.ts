import prisma from "lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  if (request.method === "POST") {
    const { id, walletTypeName: name } = await request.json();
    console.log({ name, id });
    const walletType = await prisma.walletType.update({ where: { id }, data: { name } });

    return NextResponse.json({ message: `Successfully updated type name to, "${walletType.name}".`, status: 200 });
  } else {
    return NextResponse.json({ message: "Route no valid", status: 500 });
  }
}
