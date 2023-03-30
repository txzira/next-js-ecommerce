"use client";
import React, { useState } from "react";
import { OrderDetails, OrderTable } from "./Orders";
import { OrderSummary } from "types/ordersummary";
import useSWR from "swr";

export default function AdminOrdersPage() {
  const [order, setOrder] = useState<OrderSummary>();
  const [limit, setLimit] = useState(10);
  const [cursor, setCursor] = useState(0);
  const [sort, setSort] = useState("asc");
  const fetcher = (url) => fetch(url, { method: "GET" }).then((res) => res.json());
  const { data, error, isLoading, mutate } = useSWR(`/admin/orders/get-orders/${limit}/${cursor}/${sort}`, fetcher);

  return (
    <div className="flex flex-row h-full gap-40 ">
      <OrderTable data={data} setOrder={setOrder} isLoading={isLoading} setCursor={setCursor} limit={limit} setLimit={setLimit} />
      <div className="border-l-[1px] border-slate-600"></div>
      <div className="flex flex-col">
        <h1 className="text-4xl font-bold pb-5">Order Information</h1>
        {order ? <OrderDetails order={order} mutate={mutate} /> : <div>Click on an order for more information.</div>}
      </div>
    </div>
  );
}
