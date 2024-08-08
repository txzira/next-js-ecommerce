import prisma from "lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "lib/nodemailer";

export async function POST(request: NextRequest) {
  try {
    if (request.method === "POST") {
      const { email } = await request.json();
      const user = await prisma!.user.findUnique({ where: { email } });
      if (!user) {
        return NextResponse.json({ message: "Email not found", status: 404 });
      }
      const hours = 3;
      const expiration_date = new Date(Date.now() + 60 * 60 * hours * 1000);
      const token = await prisma!.token.create({
        data: {
          user_id: user.id,
          expir_at: expiration_date,
          token_type: "PASSWORD_RESET",
        },
        select: {
          id: true,
          user_id: true,
          user: { select: { firstName: true } },
        },
      });

      const link = new URL(
        `${process.env.NEXT_PUBLIC_BASE_URL}/auth/forgot-password`
      );
      link.searchParams.append("userId", token.user_id.toString());
      link.searchParams.append("tokenId", token.id);
      const message = `<div style="width:50%; margin:0 auto; color:black;">
              <div style="text-align:center;">
                <img width="550px" height="75px" src="${process.env.COMPANY_LOGO} "/>
              </div>
              <h2 style="color: red; text-align:center;">Forgot Your Password?</h2>
              <p>Hello ${token.user.firstName},</p>
              <br/>
              <p>We have received a request to change your password on ${process.env.COMPANY_NAME}.</p>
              <p>Click <a href='${link.href}'>here</a> to reset your password. This link is valid for three hours.</p>
              <p>If you didn't request a password change or you remember your password, you can ignore this message and continue to use your current password.</p>
              <br/>
              <p>-Your favorite shreders at ${process.env.COMPANY_NAME}</p>
            </div>`;

      sendEmail(
        user.email,
        user.firstName + " " + user.lastName,
        "Password Reset",
        message
      );
      return NextResponse.json({ message: "success", status: 200 });
    } else {
      return NextResponse.json({ message: "Route not valid", status: 500 });
    }
  } catch (error) {
    console.log(error);
  }
}
