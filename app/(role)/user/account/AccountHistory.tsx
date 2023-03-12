"use client";

import { Session } from "next-auth/core/types";
import { useSession } from "next-auth/react";
import React from "react";
import useSWR from "swr";

export default function AccountHistory({ session }: { session: Session }) {
  const id = session.user.id;
  console.log(session);
  const fetcher = (url) => fetch(url, { method: "GET" }).then((res) => res.json());

  const { data, error, isLoading } = useSWR(`/user/account/get-customer-order/${id}`, fetcher);
  console.log(data);

  return (
    <table className="border-2 border-black text-center">
      <tr className="bg-black text-white">
        <th className="p-3">Order #</th>
        <th className="p-3">Date</th>
        <th className="p-3">Total</th>
        <th className="p-3">Order Status</th>
      </tr>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        data.userOrders.map((order) => {
          return (
            <tr>
              <td className="p-3">{order.id}</td>
              <td className="p-3">{new Date(order.date).toDateString()}</td>
              <td className="p-3">{order.amount}</td>
              <td className="p-3">{order.approved ? "Approved" : "Pending"}</td>
            </tr>
          );
        })
      )}
      {/* {data &&
        data.userOrders.map((order) => {
          return (
            <tr>
              <td className="p-3">{order.id}</td>
              <td className="p-3">{new Date(order.date).toDateString()}</td>
              <td className="p-3">{order.amount}</td>
              <td className="p-3">{order.approved ? "Approved" : "Pending"}</td>
            </tr>
          );
        })} */}
    </table>
  );
}
