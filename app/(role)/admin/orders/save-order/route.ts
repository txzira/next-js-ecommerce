import prisma from "lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  if (request.method === "POST") {
    const { orderId, approved, trackingNumber } = await request.json();
    console.log(request.body, orderId, approved);
    try {
      await prisma.order.update({ data: { approved, trackingNumber }, where: { id: orderId } });
      return NextResponse.json({
        message: `Order status set to, ${approved ? "Approved" : "Unapproved"}, and information saved to database!`,
        status: 200,
      });
    } catch (error) {
      return NextResponse.json({ message: error, status: 400 });
    }
  } else {
    return NextResponse.json({ message: "Route not valid", status: 500 });
  }
}
