import prisma from "lib/prisma";
import { hashPassword } from "lib/hash";

import jwt from "jsonwebtoken";
import { validateEmail, validatePassword } from "pages/api/auth/[...nextauth]";
import { NextRequest, NextResponse } from "next/server";
import { SendEmail } from "lib/mailjet";
// planetscale
// minimum 1 read row per call
// maximum 1 read and 1 write per call
export async function POST(request: NextRequest) {
  if (request.method === "POST") {
    const { email, password, name } = await request.json();
    if (!email || !email.includes("@") || !password || !name.includes(" ")) {
      return NextResponse.json({ message: "Invalid data.", status: 422 });
    }
    if (!validateEmail(email))
      return NextResponse.json({ message: "Invalid email.", status: 400 });
    if (!validatePassword(password))
      return NextResponse.json({ message: "Invalid password.", status: 400 });
    const firstName = name.split(" ")[0];
    const lastName = name.split(" ")[1];

    //connect to database
    const dbUser = await prisma.user.findUnique({
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
      const hashedPassword = await hashPassword(password);
      //insert new user into database
      const newUser = await prisma.user.create({
        data: {
          email: email,
          password: hashedPassword,
          firstName: firstName,
          lastName: lastName,
        },
      });
      const token = jwt.sign(
        { id: newUser.id, email: newUser.email },
        process.env.NEXTAUTH_SECRET,
        { expiresIn: "1d" }
      );

      const { origin } = request.nextUrl;
      const link = `${origin}/auth/verify/${token}`;
      const message = `<div>Email verification link will expire in 24 hours.</div></br><div>To verify your email copy and paste, or click the link below: </div></br><div>${link}</div>`;
      SendEmail(
        newUser.email,
        newUser.firstName + " " + newUser.lastName,
        "Email Verification Link",
        message
      );
      return NextResponse.json({ message: "User created.", status: 200 });
    }
  } else {
    //Response for other than POST method
    return NextResponse.json({ message: "Route not valid.", status: 500 });
  }
}
