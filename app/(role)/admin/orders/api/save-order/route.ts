// import prisma from "lib/prisma";
// import { NextResponse, NextRequest } from "next/server";

// export async function POST(request: NextRequest) {
//   try {
//     if (request.method === "POST") {
//       const { orderId, approved, trackingNumber } = await request.json();
//       await prisma.order.update({ data: { approved, trackingNumber }, where: { id: orderId } });
//       return NextResponse.json(`Order status set to, ${approved ? "Approved" : "Unapproved"}, and information saved to database!`, {
//         status: 200,
//       });
//     } else {
//       return NextResponse.json("Route not valid", { status: 500 });
//     }
//   } catch (error) {
//     return NextResponse.json(error.message, { status: 400 });
//   }
// }
