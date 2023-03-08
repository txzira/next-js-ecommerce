"use client";
import { User } from "@prisma/client";
import React, { useState } from "react";
import useSWR from "swr";

export function CustomerTable() {
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [sort, setSort] = useState("asc");
  const fetcher = (url) => fetch(url, { method: "GET" }).then((res) => res.json());
  const { data, error, isLoading } = useSWR(`/admin/customers/get-customer/${page}/${limit}/${sort}`, fetcher);

  return (
    <table className="border-2 border-black text-center">
      <tr className="bg-black text-white">
        <th className="p-3">Id</th>
        <th className="p-3">Email</th>
        <th className="p-3">First Name</th>
        <th className="p-3">Last Name</th>
        <th className="p-3">Role</th>
        <th className="p-3">Verified</th>
      </tr>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        data.customers.map((customer) => {
          return (
            <tr key={customer.id} className="hover:bg-white">
              <td className="p-2">{customer.id}</td>
              <td className="p-2">{customer.email}</td>
              <td className="p-2">{customer.firstName}</td>
              <td className="p-2">{customer.lastName}</td>
              <td className="p-2">{customer.role}</td>
              <td className="p-2">{customer.verified ? "yes" : "no"}</td>
            </tr>
          );
        })
      )}
      <tr>
        <td className="p-2">
          <button>&lt;-</button>
        </td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td className="p-2">
          <button>-&gt;</button>
        </td>
      </tr>
    </table>
  );
}

export function CustomerDetails({ customer }: { customer: User }) {
  return (
    <div>
      <h1>hello</h1>
    </div>
  );
}
