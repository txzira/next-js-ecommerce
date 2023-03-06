import prisma from "lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest, context: { params }) {
  if (request.method === "GET") {
    const page = Number(context.params.page);
    const limit = Number(context.params.limit);
    const sort = context.params.sort;

    console.log({ page, limit, sort });
    const customers = await prisma.user.findMany({
      take: Number(limit),
      ...(page === 0 && { skip: 0 }),
      ...(page !== 0 && { skip: 1 }),
      // ...(cursorId && { cursor: { id: cursorId } }),
      orderBy: { id: sort },
    });
    console.log(customers);
    return NextResponse.json({ customers, status: 200 });
  } else {
    return NextResponse.json({ message: "Route no valid", status: 500 });
  }
}
