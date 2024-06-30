import prisma from "lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { SendEmail } from "lib/mailjet";

export async function POST(request: NextRequest) {
  //   if (request.method === "POST") {
  //     const { email } = await request.json();
  //     const user = await prisma.user.findUnique({ where: { email } });
  //     if (!user) {
  //       return NextResponse.json({ message: "Email not found", status: 404 });
  //     }
  //     const token = jwt.sign({ id: user.id }, process.env.NEXTAUTH_SECRET, { expiresIn: 900 });
  //     await prisma.user.update({ where: { id: user.id }, data: { resetToken: token } });
  //     const { origin } = request.nextUrl;
  //     const link = `${origin}/auth/forgot-password/${token}`;
  //     const message = `<div>To reset your password copy and paste, or click the link below:</div></br><div>${link}</div>`;
  //     SendEmail(user.email, user.firstName + " " + user.lastName, "Password Reset", message);
  //     return NextResponse.json({ message: "Password", status: 200 });
  //   } else {
  //     return NextResponse.json({ message: "Route not valid", status: 500 });
  //   }
}
