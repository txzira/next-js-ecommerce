import { Order, orderProduct, User, Image as Img, Product } from "@prisma/client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { AiOutlineLeft } from "react-icons/ai";
import { OrderSummary } from "types/ordersummary";
import Loader from "app/Loader";
import { KeyedMutator } from "swr";

export function OrderTable({
  setOrder,
  data,
  isLoading,
}: {
  setOrder: React.Dispatch<React.SetStateAction<OrderSummary>>;
  data: any;
  isLoading: boolean;
}) {
  return (
    <div className="grid w-full relative text-center border-2 border-black">
      <div className="grid grid-cols-4 border-2 border-black bg-black text-white font-bold">
        <div className="py-2">Customer</div>
        <div className="py-2">Order Date</div>
        <div className="py-2">Total</div>
        <div className="py-2">Approved</div>
      </div>
      {!isLoading ? (
        data.orders.map((order) => {
          return (
            <div className="grid grid-cols-4 border-[1px] border-black p-2 hover:bg-white" onClick={() => setOrder(order)}>
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
      <div className="grid grid-cols-4 border-[1px] border-black">
        <div className="py-2">
          <button>&lt;-</button>
        </div>
        <div></div>
        <div></div>
        <div className="py-2">
          <button>-&gt;</button>
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
  console.log(order);
  console.log(trackingNumber);
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
        <h1>Customer Information</h1>
        <div>
          <div>{order.customer.email}</div>
          <div>{order.customer.firstName}</div>
          <div>{order.customer.lastName}</div>
        </div>
      </div>
      <div>
        <h1>Shipping</h1>
        <div>
          <label>Tracking Number</label>
          <input type="text" value={trackingNumber} onChange={(event) => setTrackingNumber(event.target.value)} />
        </div>
      </div>
      <span>Products</span>
      <div className="flex flex-col  items-center">
        <ProductTable order={order} />
        <Image src={order.image.url} height={200} width={600} alt="Proof of payment" className="my-5" />
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
            <tr className="border-b-[1px] border-black">
              <td>{productObj.product.name}</td>
              <td>{productObj.quantity}</td>
              <td>{productObj.product.price}</td>
              <td>{Number(productObj.quantity) * Number(productObj.product.price)}</td>
            </tr>
          );
        })}
        <tr>
          <th>Total</th>
          <td></td>
          <td></td>
          <th>{order.amount}</th>
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
