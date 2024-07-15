import { Cart, CartItem, Order, OrderShippingAddress } from "@prisma/client";
import { USDollar } from "lib/utils";
import Image from "next/image";
import React from "react";
import { AiOutlineClose } from "react-icons/ai";

const AccountOrderDetails = ({
  order,
  setOrder,
}: {
  order:
    | (Order & {
        cart: Cart & {
          cartItems: CartItem[];
        };
        shippingAddress: OrderShippingAddress;
      })
    | null;
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
  return (
    <div
      className="fixed left-0 right-0 top-0 z-50 flex h-screen w-full bg-black bg-opacity-50 sm:inset-0 sm:h-full "
      onClick={() => setOrder(null)}>
      <div
        className="relative m-auto h-3/4 w-11/12 overflow-y-scroll rounded-lg bg-white p-2 sm:h-auto"
        onClick={(e) => e.stopPropagation()}>
        <div className="flex flex-row justify-between">
          <h1 className="pb-2 text-4xl font-bold">Order Details</h1>
          <button onClick={() => setOrder(null)}>
            <AiOutlineClose size={30} />
          </button>
        </div>
        {order ? (
          <div>
            <div className="flex flex-row justify-between">
              <div className="flex flex-col">
                <h2 className="font-semibold">Full Name</h2>
                <p className="text-sm">
                  {order.shippingAddress.firstName}{" "}
                  {order.shippingAddress.lastName}
                </p>
              </div>
              <div className="flex flex-col">
                <h2 className="font-semibold">Order Status</h2>
                <p className="text-sm">{order.status}</p>
              </div>
            </div>
            <div className="flex flex-col">
              <label className="text-lg font-semibold">Address</label>
              <p className="text-sm">
                {order.shippingAddress.streetAddress}{" "}
                {order.shippingAddress.streetAddress2}{" "}
                {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                {order.shippingAddress.zipCode}
              </p>
            </div>
            <div className="flex flex-row justify-between">
              <div>
                <h2 className="font-semibold">Order Date</h2>
                <p className="text-sm">
                  {new Date(order.date).toLocaleDateString()}
                </p>
              </div>
              <div>
                <h2 className="font-semibold">Tracking Number</h2>
                {/* <p className="text-sm">{order.trackingNumber ? order.trackingNumber : "N/A"}</p> */}
              </div>
            </div>
            <div>
              <h2 className="py-2 text-center text-lg font-semibold">
                Summary
              </h2>
              <div className="flex flex-col rounded-lg border-2 border-black text-center">
                {order.cart.cartItems.map((orderProduct) => {
                  return (
                    <div
                      key={orderProduct.productId}
                      className="flex h-max flex-row  text-sm first:rounded-t-md last:rounded-b-md only:rounded-md odd:bg-blue-50">
                      <div className="relative h-24 w-24">
                        <Image
                          className="object-contain"
                          src={orderProduct.image || ""}
                          fill
                          alt="Cart Item Image"
                        />
                      </div>
                      <div className="text-left">
                        <p className="text-lg font-medium">
                          {orderProduct.productName}
                        </p>
                        <p className="text-slate-600">
                          {orderProduct.variantName}
                        </p>
                        <div className="py-2">
                          {USDollar.format(orderProduct.price)}
                        </div>
                        <div className="py-2">Qty: {orderProduct.quantity}</div>
                      </div>
                      <div className="py-2">
                        {USDollar.format(
                          orderProduct.price * orderProduct.quantity
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div>Click on an order for more information</div>
        )}
      </div>
    </div>
  );
};

export default AccountOrderDetails;
