"use client";
import { User } from "@prisma/client";
import prisma from "lib/prisma";
import React, { useState } from "react";
import { CustomerTable, CustomerDetails } from "./Customers";
import useSWR from "swr";

export default function CustomerPage() {
  const [customer, setCustomer] = useState<User>();
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [sort, setSort] = useState("asc");
  const fetcher = (url) => fetch(url, { method: "GET" }).then((res) => res.json());
  const { data, error, isLoading, mutate } = useSWR(`/admin/customers/get-customers/${page}/${limit}/${sort}`, fetcher);
  return (
    <div className="flex flex-row h-full gap-4">
      <div className="flex flex-col">
        <h1 className="text-4xl font-bold pb-5">Customer List</h1>
        <CustomerTable data={data} setCustomer={setCustomer} isLoading={isLoading} />
      </div>
      <div className="border-l-[1px] border-slate-600"></div>
      <div className="flex flex-col">
        <h1 className="text-4xl font-bold pb-5">Customer Information</h1>
        <CustomerDetails customer={customer} mutate={mutate} />
      </div>
    </div>
  );
}
