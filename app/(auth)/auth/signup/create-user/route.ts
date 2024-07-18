import prisma from "lib/prisma";
import { genPassword } from "lib/password";

import { validateEmail, validatePassword } from "pages/api/auth/[...nextauth]";
import { NextRequest, NextResponse } from "next/server";
import { SendEmail } from "lib/mailjet";
// supabase
// minimum 1 read row per call
// maximum 1 read and 1 write per call
export async function POST(request: NextRequest) {
  try {
    if (request.method === "POST") {
      const {
        email,
        password,
        name,
      }: { email: string; password: string; name: string } =
        await request.json();
      //Check if submitted data is valid
      if (!email || !email.includes("@") || !password || !name.includes(" ")) {
        return NextResponse.json({ message: "Invalid data.", status: 422 });
      }
      //Server side validation of email
      if (!validateEmail(email))
        return NextResponse.json({ message: "Invalid email.", status: 400 });

      //Server side validation of password
      if (!validatePassword(password))
        return NextResponse.json({ message: "Invalid password.", status: 400 });

      const firstName = name.split(" ")[0];
      const lastName = name.split(" ")[1];

      //connect to database
      const dbUser = await prisma!.user.findUnique({
        where: {
          email: email,
        },
      });
      //check existing
      if (dbUser) {
        return NextResponse.json({
          message: "User already exists.",
          status: 422,
        });
      } else {
        //hash password
        const cryptoPassword = await genPassword(password);
        //insert new user into database
        const newUser = await prisma!.user.create({
          data: {
            email: email,
            password: cryptoPassword.hash,
            firstName: firstName,
            lastName: lastName,
            salt: cryptoPassword.salt,
          },
        });
        if (newUser) {
          const hours = 3;
          const expiration_date = new Date(Date.now() + 60 * 60 * hours * 1000);
          const token = await prisma!.token.create({
            data: {
              user_id: newUser.id,
              token_type: "EMAIL_VERIFICATION",
              expir_at: expiration_date,
            },
            select: {
              id: true,
              user_id: true,
              user: { select: { firstName: true } },
            },
          });
          const link = new URL(`${process.env.ORIGIN_URL}/auth/verify/`);

          link.searchParams.append("userId", token.user_id.toString());
          link.searchParams.append("tokenId", token.id);

          const message = `<div style="width:50%; margin:0 auto; color:black;">
          <div style="text-align:center;">
            <img width="550px" height="75px" src="${process.env.COMPANY_LOGO} "/>
          </div>
          <h2 style="text-align:center;">Email Verification</h2>
          <p>Hello ${token.user.firstName},</p>
          <br/>
          <p>Thank you for creating an account with us. Before you login we need you to verify your email to make sure you created this account. To verif your email copy and paste, or click the link below:</p>
          <p>${link.href}</p> 
          <p> Email verification link will expire in 3 hours.</p>
          <br/>
          <p>-Your favorite shreders at ${process.env.COMPANY_NAME}</p>
        </div>`;
          SendEmail(
            newUser.email,
            newUser.firstName + " " + newUser.lastName,
            "Email Verification Link",
            message
          );
          return NextResponse.json({
            message: `Registration Successful. Email verification was sent to ${newUser.email} and is only valid for 3hours, unverified accounts are subject to deletion after this period.`,
            status: 200,
          });
        }
      }
    } else {
      //Response for other than POST method
      return NextResponse.json({ message: "Route not valid.", status: 500 });
    }
  } catch (error) {
    console.log(error);
  }
}
