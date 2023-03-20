"use client";
import prisma from "lib/prisma";
import React, { useState } from "react";
import { OrderDetails, OrderTable } from "./Orders";
import useSWR from "swr";
import { Order } from "@prisma/client";

type OrderSummary = Order & {
  products: {
    quantity: number;
    product: {
      name: string;
      price: number;
    };
  }[];
  customer: {
    email: string;
    firstName: string;
    lastName: string;
  };
  image: {
    url: string;
  };
};

export default function AdminOrdersPage() {
  // async function getOrders({ limit, pageNum, sortId, cursorId = null }) {
  //   const orders = await prisma.order.findMany({
  //     include: {
  //       customer: { select: { firstName: true, lastName: true, email: true } },
  //       image: { select: { url: true } },
  //       products: { select: { quantity: true, product: { select: { name: true, price: true } } } },
  //     },
  //     take: limit,
  //     ...(pageNum === 0 && { skip: 0 }),
  //     ...(pageNum !== 0 && { skip: 1 }),
  //     ...(cursorId && { cursor: { id: cursorId } }),
  //     orderBy: { id: sortId },
  //   });
  //   return JSON.stringify(orders);
  // }
  // const orders = await getOrders({ limit: 10, pageNum: 0, sortId: "asc" });
  const [order, setOrder] = useState<OrderSummary>();
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [sort, setSort] = useState("asc");
  const fetcher = (url) => fetch(url, { method: "GET" }).then((res) => res.json());
  const { data, error, isLoading, mutate } = useSWR(`/admin/orders/get-customers/${page}/${limit}/${sort}`, fetcher);
  return (
    <>
      <div>
        <h1>AdminOrdersPage</h1>
        {/* {orders ? <OrderTable initialOrders={orders} /> : null} */}
        {/* <OrderDetails order={orders} /> */}
      </div>
      {/* // <div className="flex flex-row h-full gap-40 ">
    //   <div className="flex flex-col">
    //     <h1 className="text-4xl font-bold pb-5">Customer List</h1>
    //{orders ? <OrderTable initialOrders={orders} /> : null}
    //     <CustomerTable data={data} setCustomer={setCustomer} isLoading={isLoading} />
    //   </div>
    //   <div className="border-l-[1px] border-slate-600"></div>
    //   <div className="flex flex-col">
    //     <h1 className="text-4xl font-bold pb-5">Customer Information</h1>
    //     <CustomerDetails customer={customer} mutate={mutate} />
    //   </div>
    // </div> */}
    </>
  );
}
