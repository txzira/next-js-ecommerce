"use client";
import { Cart, CartItem, ShippingMethod } from "@prisma/client";
import Loader from "app/Loader";
import Link from "next/link";
import React, { useEffect, useState } from "react";

import { useCartState } from "app/CartProvider";
import CheckoutForm from "./CheckoutForm";
import OrderReview from "./OrderReview";

export default function CheckoutPage() {
  const { cartItems } = useCartState();
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([]);

  const [clientSecret, setClientSecret] = useState("");
  const [paymentIntent, setPaymentIntent] = useState("");
  const [orderTotalDetails, setOrderTotalDetails] = useState({
    orderTotal: 0,
    calculatedTax: 0,
    minimumCharged: false,
    shippingTotal: 0,
  });

  useEffect(() => {
    if (cartItems.length) {
      fetch("/checkout/create-payment-intent", {
        method: "POST",
        body: JSON.stringify({ cartItems }),
      })
        .then((response) => response.json())
        .then((data: any) => {
          setClientSecret(data.clientSecret);
          setPaymentIntent(data.paymentIntent);
          setOrderTotalDetails({
            ...orderTotalDetails,
            orderTotal: data.orderTotal,
            minimumCharged: data.minimumCharged,
          });
        });
    }
  }, [cartItems]);

  return cartItems && cartItems.length > 0 ? (
    <div className="mx-2 my-5 h-full sm:flex sm:flex-row">
      <CheckoutForm
        shippingMethods={shippingMethods}
        setShippingMethods={setShippingMethods}
        clientSecret={clientSecret}
        paymentIntent={paymentIntent}
        orderTotalDetails={orderTotalDetails}
        setOrderTotalDetails={setOrderTotalDetails}
      />
      <div className="hidden h-full border-l-2 border-black sm:block" />
      <div className="hidden sm:block">
        <OrderReview
          calculatedTax={orderTotalDetails.calculatedTax}
          orderTotal={orderTotalDetails.orderTotal}
          shippingTotal={orderTotalDetails.shippingTotal}
        />
      </div>
    </div>
  ) : (
    <div className="mt-8 flex justify-center">
      <p className="text-lg">
        Cart Empty. To add items{" "}
        <Link href="/products" className="text-blue-800 underline">
          click here
        </Link>
        .
      </p>
    </div>
  );
}
