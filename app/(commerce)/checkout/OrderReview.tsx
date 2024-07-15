"use client";
import React from "react";
import { useCartState } from "app/CartProvider";
import { CartItemProps } from "types/product";
import Image from "next/image";
import { USDollar, capitalizeFirstLetter } from "lib/utils";

const OrderReview = ({
  shippingTotal,
  calculatedTax,
  orderTotal,
}: {
  shippingTotal: number;
  calculatedTax: number;
  orderTotal: number;
}) => {
  const { cartItems, getCartTotal } = useCartState();
  return (
    <div>
      {cartItems.map((cartItem: CartItemProps) => {
        return (
          <div key={cartItem.id} className="flex flex-row items-center p-2">
            <div className="relative size-20">
              <Image src={cartItem.image} alt="Cart Item Image" fill />
            </div>
            <div>
              <p className="text-lg font-medium">{cartItem.productName}</p>
              {cartItem.variant &&
                cartItem.variant.productVariantAttributes.map((attribute) => {
                  return (
                    <p key={attribute.id}>
                      {capitalizeFirstLetter(attribute.attributeGroup!.name)}:{" "}
                      {attribute.attribute.name.toLowerCase()}
                    </p>
                  );
                })}
              <p>Qty: {cartItem.quantity}</p>
              <p>{USDollar.format(cartItem.price)}</p>
            </div>
            <div className="ml-auto font-medium">
              {USDollar.format(cartItem.price * cartItem.quantity)}
            </div>
          </div>
        );
      })}
      <div className="border-b border-black" />
      <p className="flex justify-between">
        <span>Subtotal:</span>
        <span>+{USDollar.format(getCartTotal())}</span>
      </p>
      <p className="flex justify-between">
        <span>Shipping:</span>
        <span>+{USDollar.format(shippingTotal)}</span>
      </p>
      <p className="flex justify-between">
        <span>Taxes:</span>
        <span>+{USDollar.format(calculatedTax / 100)}</span>
      </p>
      <div className="border-b border-black" />

      <p className="flex justify-between">
        <span>Total:</span>
        <span>{USDollar.format(orderTotal / 100)}</span>
      </p>
    </div>
  );
};

export default OrderReview;
