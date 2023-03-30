import { Order, orderProduct, User, Image as Img, Product } from "@prisma/client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { OrderSummary } from "types/ordersummary";
import Loader from "app/Loader";
import { KeyedMutator } from "swr";

export function OrderTable({
  setOrder,
  setCursor,
  setLimit,
  data,
  isLoading,
  limit,
}: {
  setOrder: React.Dispatch<React.SetStateAction<OrderSummary>>;
  setCursor: React.Dispatch<React.SetStateAction<number>>;
  setLimit: React.Dispatch<React.SetStateAction<number>>;
  data: any;
  isLoading: boolean;
  limit: number;
}) {
  const [pages, setPages] = useState<number>();
  const [page, setPage] = useState<number>(1);
  useEffect(() => {
    if (data?.count) {
      setPages(Math.ceil(Number(data.count) / Math.abs(limit)));
    }
  }, [data]);

  const changeLimit = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    event.preventDefault();
    setLimit(Number(event.target.value));
    setPage(1);
    setCursor(0);
  };

  const prevPage = () => {
    if (page > 1) {
      setCursor(data.orders[0].id);
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
      setCursor(data.orders[data.orders.length - 1].id);
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
    <div className="flex flex-col">
      <div className="flex flex-row justify-between items-center">
        <h1 className="text-4xl font-bold pb-5">Order List</h1>
        <select onChange={(event) => changeLimit(event)}>
          <option value="10" selected={true}>
            10
          </option>
          <option value="25">25</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
      </div>
      <div className="flex flex-col justify-between text-center border-2 border-black h-[500px]">
        <div>
          <div className="grid grid-cols-4 items-center bg-black text-white font-bold h-12">
            <div className="py-2">Customer</div>
            <div className="py-2">Order Date</div>
            <div className="py-2">Total</div>
            <div className="py-2">Approved</div>
          </div>
          <div className="h-[400px] overflow-y-scroll">
            {!isLoading ? (
              data.orders.map((order) => {
                return (
                  <div
                    key={order.id}
                    className="grid grid-cols-4 border-[1px] items-center hover:bg-white h-10"
                    onClick={() => setOrder(order)}
                  >
                    <div className="py-2">{`${order.customer.firstName} ${order.customer.lastName}`}</div>
                    <div className="py-2">{new Date(order.date).toDateString()}</div>
                    <div className="py-2">${order.amount}</div>
                    <div className="py-2">{order.approved ? "Yes" : "No"}</div>
                  </div>
                );
              })
            ) : (
              <div className="flex justify-center py-5">
                <Loader />
              </div>
            )}
          </div>
        </div>
        <div className="grid grid-cols-3 border-t-[1px] items-center border-black h-10">
          <div className="py-2">{page > 1 ? <button onClick={() => prevPage()}>&lt;-</button> : null}</div>
          {pages ? (
            <div>
              Page {page} of {pages}
            </div>
          ) : (
            <div>Page - of -</div>
          )}
          <div className="py-2">{page < pages ? <button onClick={() => nextPage()}>-&gt;</button> : null}</div>
        </div>
      </div>
    </div>
  );
}

export function OrderDetails({
  order,
  mutate,
}: {
  order: Order & {
    image: Img;
    products: (orderProduct & { product: Product })[];
    customer: User;
  };
  mutate: KeyedMutator<any>;
}) {
  useEffect(() => {
    setApproved(order.approved);
    order.trackingNumber === null ? setTrackingNumber("") : setTrackingNumber(order.trackingNumber);
  }, [order]);
  const [show, setShow] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [approved, setApproved] = useState<boolean>(false);
  async function saveOrder(event) {
    event.preventDefault();
    const data = await fetch("/admin/orders/save-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ orderId: order.id, approved, trackingNumber }),
    });
    const response = await data.json();
    mutate();
    toast.success(response.message);
  }
  return order ? (
    <div>
      <div>
        <h2 className="text-2xl font-semibold underline">Customer Information</h2>
        <div>
          <div className="flex flex-col">
            <label className="text-lg font-semibold">Email</label>
            <span>{order.customer.email}</span>
          </div>
          <div className="flex flex-row gap-10">
            <div className="flex flex-col">
              <label className="text-lg font-semibold">First Name</label>
              <span>{order.customer.firstName}</span>
            </div>
            <div className="flex flex-col">
              <label className="text-lg font-semibold">Last Name</label>
              <span>{order.customer.lastName}</span>
            </div>
          </div>
        </div>
      </div>
      <div>
        <h2 className="text-2xl font-semibold underline mb-2">Shipping</h2>
        <div className="flex flex-col w-64">
          <label className="text-lg font-semibold">Tracking Number</label>
          <input
            type="text"
            value={trackingNumber}
            placeholder="1Z999AA10123456784"
            onChange={(event) => setTrackingNumber(event.target.value)}
          />
        </div>
      </div>
      <h2 className="text-2xl font-semibold underline mt-2">Products</h2>
      <div className="flex flex-col  items-center">
        <ProductTable order={order} />
        {!order.isCash ? (
          <div>
            <h2 className="text-2xl font-semibold underline">Crypto Proof of Payment</h2>
            <Image src={order.image.url} height={200} width={600} alt="Proof of payment" className="my-5" />
          </div>
        ) : null}
        <div className="flex items-center gap-3 my-5">
          <span>Toggle Approval:</span>
          <label
            htmlFor="approval"
            className={`flex cursor-pointer ${approved ? "bg-green-500" : "bg-gray-300"}  w-20 h-10 rounded-full relative items-center `}
          >
            <input type="checkbox" id="approval" className="sr-only peer" checked={approved} onChange={() => setApproved(!approved)} />
            <span className="w-10 h-10 absolute bg-white rounded-full  peer-checked:left-10 shadow-xl"></span>
          </label>
        </div>
        <button
          type="button"
          className={`bg-blue-700 text-white rounded-full px-3 my-5 active:border-black active:border-2`}
          onClick={(event) => saveOrder(event)}
        >
          Save
        </button>
      </div>
    </div>
  ) : null;

  function ProductTable({
    order,
  }: {
    order: Order & {
      image: Img;
      products: (orderProduct & { product: Product })[];
      customer: User;
    };
  }) {
    return (
      <table className="w-4/5 border-2 border-black text-center my-5">
        <tr className=" bg-black text-white border-2 border-black">
          <th>Name</th>
          <th>Quantity</th>
          <th>Price</th>
          <th>Total</th>
        </tr>
        {order.products.map((productObj) => {
          return (
            <tr key={productObj.productId} className="border-b-[1px] border-black">
              <td>{productObj.product.name}</td>
              <td>{productObj.quantity}</td>
              <td>${productObj.product.price}</td>
              <td>${Number(productObj.quantity) * Number(productObj.product.price)}</td>
            </tr>
          );
        })}
        <tr>
          <th>Total</th>
          <td></td>
          <td></td>
          <th>${order.amount}</th>
        </tr>
      </table>
    );
  }

  function closeOnEscKeyDown(event) {
    if ((event.charCode || event.keyCode) === 27) {
      setShow(false);
    }
  }
}

// useEffect(() => {
//   document.body.addEventListener("keydown", closeOnEscKeyDown);
//   return function cleanup() {
//     document.body.removeEventListener("keydown", closeOnEscKeyDown);
//   };
// }, []);
