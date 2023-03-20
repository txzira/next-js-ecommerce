import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, context: { params }) {
  if (request.method === "GET") {
    const page = Number(context.params.page);
    const limit = Number(context.params.limit);
    const sort = context.params.sort;
  } else {
    return NextResponse.json({ message: "Route no valid", status: 500 });
  }
}
