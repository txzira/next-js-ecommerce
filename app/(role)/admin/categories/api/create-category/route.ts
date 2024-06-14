import prisma from "lib/prisma";
import { USERTYPE } from "middleware";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "pages/api/auth/[...nextauth]";

export async function POST(request: NextRequest) {
  try {
    if (request.method === "POST") {
      const session = await getServerSession(authOptions);
      if (session.user.role !== USERTYPE.ADMIN) {
        return NextResponse.json("Unauthorized Request", { status: 401 });
      }
      const {
        category,
      }: {
        category: {
          name: string;
          slug: string;
          description: string;
          parent: {
            id: any;
            name: string;
          };
        };
      } = await request.json();
      const addedCategory = await prisma.category.create({
        data: {
          name: category.name,
          slug: category.slug,
          description: category.description,
          ...(category.parent.id && {
            parent: { connect: { id: category.parent.id } },
          }),
        },
      });
      return NextResponse.json(
        {
          message: `Product category ${addedCategory.name} successfully added.`,
          id: addedCategory.id,
        },
        { status: 201 }
      );
    } else {
      return NextResponse.json("Route no valid", { status: 500 });
    }
  } catch (error) {
    if (error.code === "P2002")
      return NextResponse.json(`Product category already exist.`, {
        status: 400,
      });
    return NextResponse.json(error.message, { status: 400 });
  }
}
