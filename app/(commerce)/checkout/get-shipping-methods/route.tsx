import prisma from "lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    if (request.method === "GET") {
      const country = request.nextUrl.searchParams.get("country");
      if (country) {
        const shippingMethods = await prisma.shippingMethod.findMany({
          where: { active: true, countries: { has: country } },
        });
        return NextResponse.json({
          shippingMethods,
          status: 200,
        });
      } else {
        return NextResponse.json({
          message: "Invalid country",
          status: 400,
        });
      }
    } else {
      return NextResponse.json({ message: "Route no valid", status: 500 });
    }
  } catch (error) {
    console.log(error);
  }
}
