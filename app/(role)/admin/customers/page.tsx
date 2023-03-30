"use client";
import React, { useState } from "react";
import { CustomerTable, CustomerDetails } from "./Customers";
import { User } from "@prisma/client";
import useSWR from "swr";

export default function CustomerPage() {
  const [customer, setCustomer] = useState<User>();
  const [limit, setLimit] = useState(10);
  const [cursor, setCursor] = useState(0);
  const [sort, setSort] = useState("asc");
  const fetcher = (url) => fetch(url, { method: "GET" }).then((res) => res.json());
  const { data, error, isLoading, mutate } = useSWR(`/admin/customers/get-customers/${limit}/${cursor}/${sort}`, fetcher);

  return (
    <div className="flex flex-row h-full gap-32">
      <CustomerTable data={data} setCustomer={setCustomer} isLoading={isLoading} setCursor={setCursor} limit={limit} setLimit={setLimit} />
      <div className="border-l-[1px] border-slate-600"></div>
      <div className="flex flex-col">
        <h1 className="text-4xl font-bold pb-5">Customer Information</h1>
        {customer ? (
          <CustomerDetails customer={customer} setCustomer={setCustomer} mutate={mutate} />
        ) : (
          <div>Click on a customer for more information.</div>
        )}
      </div>
    </div>
  );
}
