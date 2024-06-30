import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "lib/prisma";
import { hashPassword } from "lib/hash";

export async function PATCH(request: NextRequest, context: { params }) {
  // try {
  //   if (request.method === "PATCH") {
  //     const { token } = context.params;
  //     const { password, confirmPassword } = await request.json();
  //     if (password === confirmPassword) {
  //       const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET);
  //       const user = await prisma.user.findUnique({ where: { id: decoded.id } });
  //       if (user.resetToken === token) {
  //         const hashedPassword = await hashPassword(password);
  //         await prisma.user.update({ where: { id: decoded.id }, data: { password: hashedPassword, resetToken: null } });
  //         return NextResponse.json({ message: "Password updated successfully", status: 200 });
  //       } else {
  //         return NextResponse.json({ message: "Invalid Token", status: 400 });
  //       }
  //     } else {
  //       return NextResponse.json({ message: "Passwords do not match", status: 400 });
  //     }
  //   } else {
  //     return NextResponse.json({ message: "Route not valide", status: 500 });
  //   }
  // } catch (error) {
  //   if (error.name === "TokenExpiredError") return NextResponse.json({ message: "Password reset link expired.", status: 400 });
  //   if (error.name === "JsonWebTokenError") return NextResponse.json({ message: "Invalid reset link.", status: 400 });
  //   return NextResponse.json({ message: error.message, status: 400 });
  // }
}
