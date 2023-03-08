import prisma from "lib/prisma";
import React from "react";
import { CustomerTable, CustomerDetails } from "./Customer";

export default async function CustomerPage() {
  // async function getCustomers(limit, pageNum, sortId, cursorId = null) {
  //   const customers = await prisma.user.findMany({
  //     take: limit,
  //     ...(pageNum === 0 && { skip: 0 }),
  //     ...(pageNum !== 0 && { skip: 1 }),
  //     ...(cursorId && { cursor: { id: cursorId } }),
  //     orderBy: { id: sortId },
  //   });
  //   return customers;
  // }
  // const customers = await getCustomers(10, 0, "asc");
  return (
    <div>
      CustomerPage
      <div className="flex flex-row">
        <CustomerTable />
        <CustomerDetails />
      </div>
    </div>
  );
}
