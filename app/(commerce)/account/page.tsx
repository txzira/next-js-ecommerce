"use client";
import { Order, OrderShippingAddress, Cart, CartItem } from "@prisma/client";
import React, { useState } from "react";
import AccountInformation from "./AccountInformation";
import AccountHistory from "./AccountHistory";
import AccountOrderDetails from "./AccountOrderDetails";

export default function AccountPage() {
  const [order, setOrder] = useState<
    | (Order & {
        cart: Cart & {
          cartItems: CartItem[];
        };
        shippingAddress: OrderShippingAddress;
      })
    | null
  >(null);

  return (
    <div className="mt-8 flex flex-col ">
      <AccountInformation />

      <AccountHistory setOrder={setOrder} />
      {order ? <AccountOrderDetails order={order} setOrder={setOrder} /> : null}
    </div>
  );
}
