import {
  Cart,
  CartItem,
  Order,
  OrderBillingAddress,
  OrderShippingAddress,
} from "@prisma/client";
import PrintButton from "app/(components)/PrintButton";
import { USDollar, capitalizeFirstLetter } from "lib/utils";
import Image from "next/image";
import React from "react";
import { AiFillPrinter } from "react-icons/ai";

const OrderConfirmation = ({
  order,
}: {
  order:
    | (Order & {
        cart: Cart & { cartItems: CartItem[] };
        shippingAddress: OrderShippingAddress | null;
        billingAddress: OrderBillingAddress | null;
        shippingMethod: { name: string; price: number };
        customer: { firstName: string; lastName: string } | null;
        card: {
          brand: string;
          lastFourDigits: string;
          expir_month: number;
          expir_year: number;
        };
      })
    | null;
}) => {
  if (order) {
    return (
      <div>
        <div className="mb-3 flex w-max flex-row items-center border bg-white p-5">
          <Image
            src="/images/check_circle.svg"
            width={25}
            height={25}
            alt="check mark"
          />
          <h1 className="m-0 font-medium">Thank you for your order</h1>
        </div>
        <div className="flex flex-col gap-5 sm:flex-row">
          <div className="h-max border bg-white p-3 sm:w-3/4 sm:p-5">
            <div className="flex w-full flex-row justify-between">
              <div className="w-1/2">
                <p className="flex flex-row justify-between">
                  <span className="text-slate-400">Order Number</span>
                  <span>{order.id}</span>
                </p>
                <p className="flex flex-row justify-between">
                  <span className="text-slate-400">Order Date</span>
                  <span>{order.date.toLocaleDateString()}</span>
                </p>
                <p className="flex flex-row justify-between">
                  <span className="text-slate-400">Customer</span>
                  <span>
                    {order.customer
                      ? order.customer.firstName + " " + order.customer.lastName
                      : order.shippingAddress?.firstName +
                        " " +
                        order.shippingAddress?.lastName}
                  </span>
                </p>
              </div>

              <div className="flex items-center">
                <PrintButton className="flex flex-row items-center gap-2 border border-black px-4 py-3" />
              </div>
            </div>

            <p className="mt-2">
              Please keep the above numbers for your reference. We&apos;ll also
              send an order confirmation email to `{order.customerEmail}`.
              Please allow up to 24 hours for us to process your order for
              shipment.
            </p>
            <div>
              <div className="mt-5 flex flex-col gap-5 sm:mt-0 sm:flex-row sm:gap-80">
                <section>
                  <h2 className="text-lg font-medium">Shipping Address</h2>
                  <div>
                    <p className="m-0">
                      {order.shippingAddress?.firstName +
                        " " +
                        order.shippingAddress?.lastName}
                    </p>
                    <p className="m-0">
                      {order.shippingAddress?.streetAddress}
                      {order.shippingAddress?.streetAddress2
                        ? " " + order.shippingAddress?.streetAddress2
                        : null}
                    </p>
                    <p className="m-0">
                      {order.shippingAddress?.city +
                        ", " +
                        order.shippingAddress?.state +
                        " " +
                        order.shippingAddress?.zipCode +
                        " " +
                        order.shippingAddress?.country}
                    </p>
                    <p className="m-0">{order.shippingAddress?.phone}</p>
                  </div>
                </section>
                <section>
                  <h2 className="text-lg font-medium">Billing Address</h2>
                  <div>
                    <p className="m-0">
                      {order.billingAddress?.firstName +
                        " " +
                        order.billingAddress?.lastName}
                    </p>
                    <p className="m-0">
                      {order.billingAddress?.streetAddress}
                      {order.billingAddress?.streetAddress2
                        ? " " + order.billingAddress?.streetAddress2
                        : null}
                    </p>
                    <p className="m-0">
                      {order.billingAddress?.city +
                        ", " +
                        order.billingAddress?.state +
                        " " +
                        order.billingAddress?.zipCode +
                        " " +
                        order.billingAddress?.country}
                    </p>

                    <p className="!m-0">{order.billingAddress?.phone}</p>
                  </div>
                </section>
              </div>
              <div className="mt-5 flex flex-col gap-5 sm:mt-0 sm:flex-row sm:gap-80">
                <section>
                  <h2 className="text-lg font-medium">Payment Method</h2>
                  <div className="flex flex-row">
                    <Image
                      width={40}
                      height={40}
                      alt="credit-card"
                      className="mb-auto mr-2"
                      src={`/images/creditcards/${order.card?.brand}.svg`}
                    />
                    <div>
                      <p>
                        <span>{capitalizeFirstLetter(order.card?.brand)}</span>
                        <span>●●●●●●●●●●●●{order.card?.lastFourDigits}</span>
                      </p>
                      <p>
                        Exp: {order.card?.expir_month}/{order.card?.expir_year}
                      </p>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-lg font-medium">Shipping Method</h2>
                  <p>
                    {order.shippingMethod.name} -
                    {USDollar.format(order.shippingMethod.price)}
                  </p>
                </section>
              </div>
            </div>
          </div>
          <div className="flex-1 border bg-white p-3">
            <h1 className="!font-medium">Order Summary</h1>

            <div>
              {order.cart.cartItems.map((item) => {
                return (
                  <div key={item.id}>
                    <div className="my-2 flex flex-row items-center">
                      <Image
                        src={item.image!}
                        width={50}
                        height={50}
                        className="mr-3"
                        alt="cart item image"
                      />
                      <div>
                        <p className="!m-0 truncate font-medium hover:overflow-visible">
                          {item.productName}
                        </p>
                        {item.variantName && (
                          <p className="!m-0">{item.variantName}</p>
                        )}
                        <p className="!m-0">{USDollar.format(item.price)}</p>
                        <p className="!m-0">Qty: {item.quantity}</p>
                      </div>
                      <p className="!ml-auto font-medium">
                        {USDollar.format(item.quantity * item.price)}
                      </p>
                    </div>
                    <div className="black border border-b" />
                  </div>
                );
              })}
            </div>
            <div className="border-b border-black" />

            <p className="my-2 flex flex-row justify-between font-medium">
              <span>SUBTOTAL:</span>
              <span>{USDollar.format(order.cartTotal)}</span>
            </p>
            <p className="my-2 flex flex-row justify-between font-medium">
              <span>SHIPPING:</span>
              <span>{USDollar.format(order.shippingTotal)}</span>
            </p>
            <p className="my-2 flex flex-row justify-between font-medium">
              <span>TAXES:</span>
              <span>{USDollar.format(order.taxTotal)}</span>
            </p>
            <div className=" border-b border-black" />

            <p className="my-2 flex flex-row justify-between font-medium">
              <span>ORDER TOTAL:</span>
              <span>{USDollar.format(order.orderTotal)}</span>
            </p>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="mx-auto h-full sm:my-10 sm:w-[80%]">
        <h1 className="!font-medium">Order does not exist.</h1>
      </div>
    );
  }
};

export default OrderConfirmation;
