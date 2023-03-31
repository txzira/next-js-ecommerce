"use client";
import { Order, orderProduct, Product, Image } from "@prisma/client";
import React, { useState } from "react";
import { AccountInformation, AccountHistory, OrderDetails } from "./AccountHistory";

export default function AccountPage() {
  const [order, setOrder] = useState<
    Order & {
      image: Image;
      products: (orderProduct & {
        product: Product;
      })[];
    }
  >();

  return (
    <div className="flex flex-col">
      <AccountInformation />
      <div className="flex flex-row gap-32 h-full">
        <AccountHistory order={order} setOrder={setOrder} />
        <div className="border-l-[1px] border-slate-600"></div>
        <div>
          <h1 className="text-4xl font-bold pb-5">Order Details</h1>
          {order ? <OrderDetails order={order} setOrder={setOrder} /> : <div>Click on an order for more information</div>}
        </div>
      </div>
    </div>
  );
}
