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
    <div className="h-full w-[90%] mx-auto">
      <CustomerTable data={data} setCustomer={setCustomer} isLoading={isLoading} setCursor={setCursor} limit={limit} setLimit={setLimit} />
      {customer ? <CustomerDetails customer={customer} setCustomer={setCustomer} mutate={mutate} /> : null}
    </div>
  );
}
