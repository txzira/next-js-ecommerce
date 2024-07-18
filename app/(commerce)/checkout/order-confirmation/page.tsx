import React from "react";
import prisma from "lib/prisma";
import OrderConfirmation from "./OrderConfirmation";

const page = async ({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {
  const email = searchParams?.["email"]?.toString();
  const orderNumber = searchParams?.["orderNumber"];
  if (email && orderNumber) {
    const order =
      (await prisma!.order.findFirst({
        where: { id: Number(orderNumber), customerEmail: email },
        include: {
          cart: { include: { cartItems: true } },
          shippingAddress: true,
          billingAddress: true,
          shippingMethod: { select: { name: true, price: true } },
          customer: { select: { firstName: true, lastName: true } },
          card: {
            select: {
              lastFourDigits: true,
              brand: true,
              expir_month: true,
              expir_year: true,
            },
          },
        },
      })) || null;
    console.log(order);
    return (
      <div>
        <OrderConfirmation order={order} />
      </div>
    );
  } else {
    return (
      <div className="mx-auto h-full sm:my-10 sm:w-[80%]">
        <h1 className="!m-0 !font-medium">Order does not exist.</h1>
      </div>
    );
  }
};

export default page;
