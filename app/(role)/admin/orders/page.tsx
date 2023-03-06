import prisma from "lib/prisma";
import React from "react";
import { OrderTable } from "./Orders";

export default async function AdminOrdersPage() {
  async function getOrders({ limit, pageNum, sortId, cursorId = null }) {
    const orders = await prisma.order.findMany({
      include: {
        customer: { select: { firstName: true, lastName: true, email: true } },
        image: { select: { url: true } },
        products: { select: { quantity: true, product: { select: { name: true, price: true } } } },
      },
      take: limit,
      ...(pageNum === 0 && { skip: 0 }),
      ...(pageNum !== 0 && { skip: 1 }),
      ...(cursorId && { cursor: { id: cursorId } }),
      orderBy: { id: sortId },
    });
    return JSON.stringify(orders);
  }
  const orders = await getOrders({ limit: 10, pageNum: 0, sortId: "asc" });

  return (
    <div>
      <h1>AdminOrdersPage</h1>
      {orders ? <OrderTable initialOrders={orders} /> : null}
    </div>
  );
}
