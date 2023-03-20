"use client";
import { Order, orderProduct, User, Image as Img, Product } from "@prisma/client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { AiOutlineLeft } from "react-icons/ai";
import useSWR from "swr";

export function OrderTable({ initialOrders }: { initialOrders: string }) {
  const [showProducts, setShowProducts] = useState(false);
  const [orders, setOrders] = useState<
    (Order & {
      image: Img;
      products: (orderProduct & { product: Product })[];
      customer: User;
    })[]
  >(JSON.parse(initialOrders));

  const [order, setOrder] = useState<
    Order & {
      image: Img;
      products: (orderProduct & { product: Product })[];
      customer: User;
    }
  >();

  function showOrderModal(
    selectedOrder: Order & {
      image: Img;
      products: (orderProduct & { product: Product })[];
      customer: User;
    }
  ) {
    setOrder(selectedOrder);
    setShowProducts(true);
  }
  console.log(orders);
  return (
    <>
      {showProducts ? <OrdersProductModal order={order} setShow={setShowProducts} /> : null}
      <table className="text-center border-2 border-black ">
        <tr className="border-2 border-black bg-black text-white">
          <th className="p-2">Customer</th>
          <th className="p-2">Order Date</th>
          <th className="p-2">Total</th>
          <th className="p-2">Approved</th>
          <th className="p-2">Show Products</th>
        </tr>
        {orders.map((order) => {
          return (
            <>
              <tr className=" border-[1px] border-black p-2 hover:bg-white">
                <td className="p-2">{`${order.customer.firstName} ${order.customer.lastName}`}</td>
                <td className="p-2">{new Date(order.date).toDateString()}</td>
                <td className="p-2">${order.amount}</td>
                <td className="p-2">{order.approved ? "Yes" : "No"}</td>
                <td>
                  <button onClick={() => showOrderModal(order)}>Products</button>
                </td>
              </tr>
            </>
          );
        })}
        <tr>
          <td className="p-2">
            <button>&lt;-</button>
          </td>
          <td></td>
          <td></td>
          <td></td>
          <td className="p-2">
            <button>-&gt;</button>
          </td>
        </tr>
      </table>
    </>
  );
}

export function OrderDetails({
  order,
}: {
  order: Order & {
    image: Img;
    products: (orderProduct & { product: Product })[];
    customer: User;
  };
}) {
  return (
    <div>
      <h1></h1>
    </div>
  );
}

function OrdersProductModal({
  order,
  setShow,
}: {
  order: Order & {
    image: Img;
    products: (orderProduct & { product: Product })[];
    customer: User;
  };
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [approved, setApproved] = useState(order.approved);
  const router = useRouter();
  async function handleApproval(event) {
    event.preventDefault();
    const response = await fetch("/admin/orders/approve-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ orderId: order.id, approved }),
    });
    const message = await response.json();
    toast.success(message.message);
  }
  // useEffect(() => {
  //   document.body.addEventListener("keydown", closeOnEscKeyDown);
  //   return function cleanup() {
  //     document.body.removeEventListener("keydown", closeOnEscKeyDown);
  //   };
  // }, []);
  return (
    <div className="fixed bg-opacity-50 bg-black right-0 top-0 w-screen z-50 " onClick={() => setShow(false)}>
      <div className="bg-white float-right h-screen py-10 px-2.5 relative w-3/5 " onClick={(e) => e.stopPropagation()}>
        <button type="button" onClick={() => setShow(false)}>
          <AiOutlineLeft />
        </button>
        <span>Products</span>
        <div className="flex flex-col  items-center">
          <ProductTable order={order} />
          <Image src={order.image.url} height={200} width={600} alt="Proof of payment" />
          <div className="flex items-center gap-3">
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
            className={`bg-blue-700 text-white rounded-full px-3 py-1 active:border-black active:border-2`}
            onClick={(event) => handleApproval(event)}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );

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
      <table className="w-1/2 border-2 border-black text-center">
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
