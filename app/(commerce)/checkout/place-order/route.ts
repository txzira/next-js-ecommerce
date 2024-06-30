// import { Order } from "@prisma/client";
// import { uploadImage } from "lib/cloudinary";
// import prisma from "lib/prisma";
// import { getServerSession } from "next-auth";
// import { NextRequest, NextResponse } from "next/server";
// import { authOptions } from "pages/api/auth/[...nextauth]";
// import { SendEmail } from "lib/mailjet";

// export async function POST(request: NextRequest) {
//   const {
//     cartId,
//     shipping,
//     imagePath,
//     imageName,
//   }: {
//     cartId: number;
//     shipping: {
//       firstName: string;
//       lastName: string;
//       streetAddress: string;
//       streetAddress2: string;
//       city: string;
//       state: string;
//       zipCode: string;
//     };
//     imagePath: any;
//     imageName: any;
//   } = await request.json();
//   try {
//     const session = await getServerSession(authOptions);
//     if (!session) {
//       return NextResponse.json({ message: "Unauthorized access", status: 401 });
//     }
//     if (request.method === "POST") {
//       let order: Order;
//       for (const key in shipping) {
//         if (!shipping[key] && key !== "streetAddress2")
//           return NextResponse.json({ message: "Invalid shipping information from user.", status: 400 });
//       }
//       //get cart information server side
//       const cart = await prisma.cart.findFirst({ where: { id: cartId } });

//       //create wallet order
//       if (imagePath && imageName) {
//         const imageObj = await uploadImage(imagePath, imageName);
//         order = await prisma.order.create({
//           data: {
//             customer: { connect: { id: cart.userId } },
//             cart: { connect: { id: cart.id } },
//             cartTotal: cart.cartTotal,
//             shipping: { create: shipping },
//             image: { create: { assetId: imageObj.asset_id, publicId: imageObj.public_id, url: imageObj.url } },
//           },
//         });
//       } else {
//         //create cash order
//         order = await prisma.order.create({
//           data: {
//             customer: { connect: { id: cart.userId } },
//             cart: { connect: { id: cart.id } },
//             cartTotal: cart.cartTotal,
//             shippingAddress: { create: shipping },
//             isCash: true,
//           },
//         });
//       }
//       const customer = await prisma.user.findUnique({ where: { id: cart.userId } });
//       const { origin } = request.nextUrl;
//       const link = `${origin}/admin`;
//       const message = `<div>Order received from ${
//         customer.firstName + " " + customer.lastName
//       }.</div></br><div><a href=${link}>Sign in</a> as admin for further action.</div>`;
//       SendEmail("misterxcommerce@gmail.com", "Automated messenger", "Order Received", message);
//       //disable current cart
//       await prisma.cart.update({ where: { id: cart.id }, data: { currentCart: { set: false } } });
//       //create new empty cart
//       await prisma.cart.create({ data: { cartTotal: 0, userId: cart.userId } });
//       return NextResponse.json({ message: "Order sent.", status: 200 });
//     } else {
//       return NextResponse.json({ message: "Route not valid", status: 500 });
//     }
//   } catch (error) {
//     if (error.code === "P2002") {
//       return NextResponse.json({ message: `Order failed. Image name "${imageName}" already in use, please rename image.`, status: 400 });
//     }
//     return NextResponse.json({ message: error.message, status: 400 });
//   }
// }
