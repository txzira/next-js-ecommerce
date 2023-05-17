import prisma from "lib/prisma";
import { NextResponse } from "next/server";

export async function POST() {
  const users = await prisma.user.findMany({ where: { verifiedEmail: false } });
  if (users && users.length > 0) {
    return NextResponse.json({ ok: true });
  }
}
