"use client";
import { Order, orderProduct, Product, Image, ShippingAddress } from "@prisma/client";
import React, { useState } from "react";
import { AccountInformation, AccountHistory, OrderDetails } from "./AccountHistory";

export default function AccountPage() {
  const [order, setOrder] = useState<
    Order & {
      image: Image;
      products: (orderProduct & {
        product: Product;
      })[];
      shipping: ShippingAddress;
    }
  >();

  return (
    <div className="flex flex-col">
      <AccountInformation />
      <div className="flex flex-row md:gap-32 h-full">
        <AccountHistory order={order} setOrder={setOrder} />
        {/* {window.matchMedia("(min-width: 768px)").matches ? ( */}
        <>
          <div className="border-l-[1px] border-slate-600"></div>
          <div>
            <OrderDetails order={order} />
          </div>
        </>
        {/* ) : null} */}
      </div>
    </div>
  );
}
