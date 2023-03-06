import prisma from "lib/prisma";
import React from "react";
import CustomerTable from "./CustomerTable";

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
      <CustomerTable />
      {/* <table>
        <tr>
          <th>Id</th>
          <th>Email</th>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Role</th>
          <th>Verified</th>
        </tr>
        {customers.map((customer) => {
          return (
            <tr key={customer.id}>
              <td>{customer.id}</td>
              <td>{customer.email}</td>
              <td>{customer.firstName}</td>
              <td>{customer.lastName}</td>
              <td>{customer.role}</td>
              <td>{customer.verified ? "yes" : "no"}</td>
            </tr>
          );
        })}
      </table> */}
    </div>
  );
}
