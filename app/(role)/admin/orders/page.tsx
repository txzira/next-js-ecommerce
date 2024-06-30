// "use client";
// import React, { useState } from "react";
// import { OrderDetails, OrderTable } from "./Orders";
// import { OrderSummary } from "types/ordersummary";
// import useSWR from "swr";

// export default function AdminOrdersPage() {
//   const [order, setOrder] = useState<OrderSummary>();
//   const [limit, setLimit] = useState(10);
//   const [cursor, setCursor] = useState(0);
//   const [sort, setSort] = useState("asc");
//   const {
//     data: ordersData,
//     error: ordersError,
//     isLoading: ordersIsLoading,
//     mutate: ordersMutate,
//   } = useSWR<{
//     orders: OrderSummary[];
//     count: number;
//   }>(`/admin/orders/get-orders/${limit}/${cursor}/${sort}`, (url) => fetch(url, { method: "GET" }).then((res) => res.json()));
//   return (
//     <div className="h-full w-[90%] mx-auto">
//       <OrderTable
//         ordersData={ordersData}
//         setOrder={setOrder}
//         ordersIsLoading={ordersIsLoading}
//         setCursor={setCursor}
//         limit={limit}
//         setLimit={setLimit}
//       />
//       {order ? <OrderDetails order={order} ordersMutate={ordersMutate} setOrder={setOrder} /> : null}
//     </div>
//   );
// }
