import { User } from "@prisma/client";
import prisma from "lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest, context: { params }) {
  if (request.method === "GET") {
    const limit = Number(context.params.limit);
    const cursor = Number(context.params.cursor);
    const sort = context.params.sort;

    let customers: User[];
    const count = await prisma.user.count({ where: { role: "CUSTOMER" } });

    if (cursor === 0) {
      customers = await prisma.user.findMany({
        take: limit,
        orderBy: { id: sort },
      });
    } else {
      customers = await prisma.user.findMany({
        take: limit,
        skip: 1,
        cursor: { id: cursor },
        orderBy: { id: sort },
      });
    }
    customers = exclude(customers, ["password"]);
    return NextResponse.json({ customers, count, status: 200 });
  } else {
    return NextResponse.json({ message: "Route no valid", status: 500 });
  }
}

function exclude(users: User[], keys) {
  for (let x = 0; x < users.length; x++) {
    if (users[x]["role"] === "ADMIN") users.splice(x, 1);
  }
  for (let x = 0; x < users.length; x++) {
    for (let key of keys) {
      delete users[x][key];
    }
  }

  return users;
}
