"use client";
import React, { useState, useEffect } from "react";
import { OrderDetails, OrderTable } from "./Orders";
import { OrderSummary } from "types/ordersummary";
import useSWR from "swr";

export default function AdminOrdersPage() {
  const [order, setOrder] = useState<OrderSummary>();
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [sort, setSort] = useState("asc");
  const fetcher = (url) => fetch(url, { method: "GET" }).then((res) => res.json());
  const { data, error, isLoading, mutate } = useSWR(`/admin/orders/get-orders/${page}/${limit}/${sort}`, fetcher);
  useEffect(() => {
    console.log(data);
  }, [data]);
  return (
    <div className="flex flex-row h-full gap-40 ">
      <div className="flex flex-col">
        <h1 className="text-4xl font-bold pb-5">Order List</h1>
        <OrderTable data={data} setOrder={setOrder} isLoading={isLoading} />
      </div>
      <div className="border-l-[1px] border-slate-600"></div>
      <div className="flex flex-col">
        <h1 className="text-4xl font-bold pb-5">Order Information</h1>
        {order ? <OrderDetails order={order} mutate={mutate} /> : null}
      </div>
    </div>
  );
}
