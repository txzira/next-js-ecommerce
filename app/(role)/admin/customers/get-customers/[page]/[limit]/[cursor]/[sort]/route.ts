import { User } from "@prisma/client";
import prisma from "lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest, context: { params }) {
  if (request.method === "GET") {
    const page = Number(context.params.page);
    const limit = Number(context.params.limit);
    const sort = context.params.sort;
    const cursor = Number(context.params.cursor);

    // console.log({ page, limit, sort });
    let customers = await prisma.user.findMany({
      take: Number(limit),
      ...(page === 0 && { skip: 0 }),
      ...(page !== 0 && { skip: 1 }),
      // ...(cursor && { cursor: { id: cursor } }),
      orderBy: { id: sort },
    });
    customers = exclude(customers, ["password"]);
    // console.log(customers);
    return NextResponse.json({ customers, status: 200 });
  } else {
    return NextResponse.json({ message: "Route no valid", status: 500 });
  }
}

function exclude(users: User[], keys) {
  for (let x = 0; x < users.length; x++) {
    if (users[x]["role"] === "admin") users.splice(x, 1);
    for (let key of keys) {
      delete users[x][key];
    }
  }

  return users;
}
