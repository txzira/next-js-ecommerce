import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "lib/prisma";

export async function PATCH(request: NextRequest, context: { params: any }) {
  try {
    if (request.method === "PATCH") {
      const { token } = context.params;
      const decoded: any = jwt.verify(token, process.env.NEXTAUTH_SECRET!);
      const user = await prisma.user.findUnique({ where: { id: decoded.id } });
      if (user?.verifiedEmail) {
        return NextResponse.json({
          message: "Email already verified.",
          status: 422,
        });
      } else {
        await prisma.user.update({
          where: { id: decoded.id },
          data: { verifiedEmail: { set: true } },
        });
        return NextResponse.json({
          message: "Email successfully verified.",
          status: 200,
        });
      }
    } else {
      return NextResponse.json({ message: "Route not valid.", status: 500 });
    }
  } catch (error: any) {
    if (error.name === "TokenExpiredError")
      return NextResponse.json({
        message: "Email verification link expired.",
        status: 400,
      });
    if (error.name === "JsonWebTokenError")
      return NextResponse.json({
        message: "Invalid email verification link.",
        status: 400,
      });
    return NextResponse.json({ message: error.message, status: 400 });
  }
}
