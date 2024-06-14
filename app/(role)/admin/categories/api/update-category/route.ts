import { Category } from "@prisma/client";
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
        category: Category & {
          parent: Category;
          children: Category[];
        };
      } = await request.json();

      await prisma.category.update({
        where: { id: category.id },
        data: {
          name: category.name,
          slug: category.slug,
          description: category.description,
          parent: { connect: { id: category.parent.id } },
        },
      });
      return NextResponse.json("Category updated successfully", {
        status: 200,
      });
    } else {
      return NextResponse.json("Route no valid", { status: 500 });
    }
  } catch (error) {
    return NextResponse.json(error.message, { status: 400 });
  }
}
