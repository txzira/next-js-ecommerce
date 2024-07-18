import { genPassword, verifyPassword } from "lib/password";
import prisma from "lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "pages/api/auth/[...nextauth]";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      throw new Error("Unauthorized Request");
    }
    if (request.method === "POST") {
      const { currentPassword, newPassword, confirmPassword } =
        await request.json();
      console.log(currentPassword, newPassword, confirmPassword);
      // passwords match
      if (newPassword === confirmPassword) {
        const user = await prisma!.user.findUnique({
          where: { id: session.user.id },
        });
        const checkPassword = await verifyPassword(
          currentPassword,
          user?.password!,
          user?.salt!
        );
        if (checkPassword) {
          const checkIfSamePassword = await verifyPassword(
            newPassword,
            user?.password!,
            user?.salt!
          );
          if (!checkIfSamePassword) {
            const { salt, hash } = await genPassword(newPassword);
            await prisma!.user.update({
              where: { id: session.user.id },
              data: {
                password: hash,
                salt: salt,
              },
            });
            return NextResponse.json(
              {
                message: "Password successfully changed.",
              },
              { status: 200 }
            );
          } else {
            return NextResponse.json(
              {
                message:
                  "Invalid Password: New password cannot be same the same as old password",
              },
              {
                status: 400,
              }
            );
          }
        } else {
          return NextResponse.json(
            {
              message:
                "Invalid Password: The current password you have entered does not match your password.",
            },
            { status: 400 }
          );
        }
      } else {
        return NextResponse.json(
          {
            message:
              "Invalid Password: New and re-typed passwords do not match.",
          },
          { status: 400 }
        );
      }
    } else {
      return NextResponse.json({ message: "Route no valid" }, { status: 500 });
    }
  } catch (error: any) {
    return NextResponse.json(
      {
        message: error.message,
      },
      { status: 400 }
    );
  }
}
