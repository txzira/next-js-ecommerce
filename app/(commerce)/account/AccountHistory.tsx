import { Cart, CartItem, Order, OrderShippingAddress } from "@prisma/client";
import Loader from "app/Loader";
import React, { useEffect, useState } from "react";
import useSWR from "swr";
import toast from "react-hot-toast";
import { USDollar } from "lib/utils";

const AccountHistory = ({
  setOrder,
}: {
  setOrder: React.Dispatch<
    React.SetStateAction<
      | (Order & {
          cart: Cart & {
            cartItems: CartItem[];
          };
          shippingAddress: OrderShippingAddress;
        })
      | null
    >
  >;
}) => {
  const [count, setCount] = useState(0);
  const [pages, setPages] = useState<number>(1);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState(10);

  const [orders, setOrders] = useState([]);
  useEffect(() => {
    fetch(`/account/get-initial-orders?limit=${limit}`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 200) {
          setCount(data.orders[0]);
          setOrders(data.orders[1]);
        }
      });
  }, [limit]);

  const changeLimit = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    event.preventDefault();
    setLimit(Number(event.target.value));
    setPage(1);
    setPage(0);
  };

  const prevPage = () => {
    if (page > 1) {
      // setPage(data.userOrders[0].id);
      if (limit > 0) {
        setLimit(limit * -1);
      }

      setPage(page - 1);
      setOrder(null);
    } else {
      toast.error("Request page out of bounds");
    }
  };
  const nextPage = () => {
    if (page < pages) {
      // setPage(data.userOrders[data.userOrders.length - 1].id);
      if (limit < 0) {
        setLimit(limit * -1);
      }
      setPage(page + 1);
      setOrder(null);
    } else {
      toast.error("Request page out of bounds");
    }
  };

  return (
    <div className="my-8 flex h-full w-full flex-col rounded-xl p-2 md:w-1/3">
      <div className="flex flex-row items-center justify-between pb-5">
        <h1 className="rounded-md  border-2 border-black bg-white px-2 py-1 text-2xl font-bold shadow-lg md:text-4xl">
          Order List
        </h1>
        <select
          className="rounded-md border-2 border-black"
          defaultValue="10"
          onChange={(event) => changeLimit(event)}>
          <option value="10" defaultValue="10">
            10
          </option>
          <option value="25">25</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
      </div>
      <div className="w-full rounded-xl border-2 border-black  text-center shadow-lg">
        <div className="grid h-12 w-full grid-cols-5 items-center rounded-t-lg bg-black text-sm font-semibold text-white ">
          <div className="md:px-1">Order #</div>
          <div className="md:px-1">Date</div>
          <div className="md:px-1">Total</div>
          <div className="md:px-1">Order Status</div>
        </div>
        <div className="h-[400px] overflow-y-scroll bg-white">
          {orders.length ? (
            orders.map(
              (
                order: Order & {
                  cart: Cart & {
                    cartItems: CartItem[];
                  };
                  shippingAddress: OrderShippingAddress;
                }
              ) => {
                const date = new Date(order.date);
                return (
                  <div
                    className="grid h-10 cursor-pointer  grid-cols-5 items-center text-sm even:bg-slate-200 "
                    key={order.id}
                    onClick={() => setOrder(order)}>
                    <div className="py-2">{order.id}</div>
                    <div className="py-2">{`${
                      date.getMonth() + 1
                    }/${date.getDate()}/${date.getFullYear()}`}</div>
                    <div className="py-2">
                      {USDollar.format(order.orderTotal)}
                    </div>
                    <div className="py-2">{order.status}</div>
                  </div>
                );
              }
            )
          ) : (
            <div className="flex justify-center py-5">
              <Loader />
            </div>
          )}
        </div>
        <div className="grid h-10 grid-cols-3 items-center  rounded-b-xl border-t-[1px] border-black bg-white">
          <div className="py-2">
            {page > 1 ? (
              <button onClick={() => prevPage()}>&lt;-</button>
            ) : null}
          </div>
          {pages ? (
            <div>
              Page {page} of {pages}
            </div>
          ) : (
            <div>Page - of -</div>
          )}
          <div className="py-2">
            {page < pages ? (
              <button onClick={() => nextPage()}>-&gt;</button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountHistory;
