import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  if (request.method === "POST") {
    const { currentPassword, newPassword } = await request.json();
    console.log(currentPassword, newPassword);
  } else {
    return NextResponse.json({ message: "Route no valid", status: 500 });
  }
}
