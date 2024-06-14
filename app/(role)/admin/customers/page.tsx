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
  const {
    data: customersData,
    error,
    isLoading: customersIsLoading,
    mutate: customersMutate,
  } = useSWR<{ customers: User[]; customerCount: number }>(`/admin/customers/get-customers/${limit}/${cursor}/${sort}`, (url) =>
    fetch(url, { method: "GET" }).then((res) => res.json())
  );

  return (
    <div className="h-full w-[90%] mx-auto">
      <CustomerTable
        customersData={customersData}
        setCustomer={setCustomer}
        customersIsLoading={customersIsLoading}
        setCursor={setCursor}
        limit={limit}
        setLimit={setLimit}
      />
      {customer ? <CustomerDetails customer={customer} setCustomer={setCustomer} customersMutate={customersMutate} /> : null}
    </div>
  );
}
