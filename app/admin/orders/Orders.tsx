"use client";
import { Order, orderProduct, User, Image, Product } from "@prisma/client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { AiOutlineLeft } from "react-icons/ai";
import useSWR from "swr";

export function OrderTable({ initialOrders }: { initialOrders: string }) {
  const [showProducts, setShowProducts] = useState(false);
  const [orders, setOrders] = useState<
    (Order & {
      image: Image;
      products: orderProduct[];
      customer: User;
    })[]
  >(JSON.parse(initialOrders));

  const [products, setProducts] = useState<orderProduct[]>(orders[0].products);
  const [total, setTotal] = useState(0);

  function showProductsModal(products: orderProduct[], total: number) {
    setProducts(products);
    setTotal(total);
    setShowProducts(true);
  }
  console.log(orders);
  return (
    <>
      {showProducts ? <OrdersProductModal products={products} setShow={setShowProducts} total={total} /> : null}
      <table>
        <tr>
          <th>Customer</th>
          <th>Order Date</th>
          <th>Total</th>
          <th>Show Products</th>
          <th>Approved</th>
        </tr>
        {orders.map((order) => {
          return (
            <>
              <tr>
                <td>{`${order.customer.firstName} ${order.customer.lastName}`}</td>
                <td>{new Date(order.date).toDateString()}</td>
                <td>${order.amount}</td>
                <td>
                  <button onClick={() => showProductsModal(order.products, order.amount)}>Products</button>
                </td>
                <td>{order.approved ? "Yes" : "No"}</td>
              </tr>
            </>
          );
        })}
      </table>
    </>
  );
}

export function OrdersProductModal({ products, setShow, total }) {
  useEffect(() => {
    document.body.addEventListener("keydown", closeOnEscKeyDown);
    return function cleanup() {
      document.body.removeEventListener("keydown", closeOnEscKeyDown);
    };
  }, []);

  return (
    <div className="fixed bg-opacity-50 bg-black right-0 top-0 w-screen z-50 " onClick={() => setShow(false)}>
      <div className="bg-white float-right h-screen py-10 px-2.5 relative w-3/5 " onClick={(e) => e.stopPropagation()}>
        <button type="button" onClick={() => setShow(false)}>
          <AiOutlineLeft />
        </button>
        <span>Products</span>
        <table>
          <tr>
            <th>Name</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Total</th>
          </tr>

          {products.map((product) => {
            return (
              <tr>
                <td>{product.product.name}</td>
                <td>{product.quantity}</td>
                <td>{product.product.price}</td>
                <td>{Number(product.quantity) * Number(product.product.price)}</td>
              </tr>
            );
          })}
          <tr>
            <th>Total</th>
            <td></td>
            <td></td>
            <td>{total}</td>
          </tr>
        </table>
      </div>
    </div>
  );

  function closeOnEscKeyDown(e) {
    if ((e.charCode || e.keyCode) === 27) {
      setShow(false);
    }
  }
}
