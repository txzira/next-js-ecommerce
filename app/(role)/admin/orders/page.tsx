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
  console.log(data);
  return (
    <div className="h-full w-[90%] mx-auto">
      <OrderTable data={data} setOrder={setOrder} isLoading={isLoading} setCursor={setCursor} limit={limit} setLimit={setLimit} />
      {order ? <OrderDetails order={order} mutate={mutate} setOrder={setOrder} /> : null}
    </div>
  );
}
