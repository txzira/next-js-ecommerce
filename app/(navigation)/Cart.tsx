import useSWR, { KeyedMutator } from "swr";
import { AiOutlineClose } from "react-icons/ai";
import { BsDashCircleFill, BsFillTrashFill, BsPlusCircleFill } from "react-icons/bs";
import { CartItem, Cart } from "@prisma/client";
import React, { useEffect, useState } from "react";
import Link from "next/link";

export default function CartModal({
  cart,
  setShow,
  mutate,
}: {
  cart: Cart & {
    cartItems: CartItem[];
  };
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  mutate: KeyedMutator<any>;
}) {
  useEffect(() => {
    mutate();
  }, []);
  console.log(cart);
  return (
    <div
      className="flex fixed bg-opacity-50 top-0 left-0 right-0 bg-black w-full md:h-full md:inset-0 h-full z-50 overflow-y-scroll  "
      onClick={() => setShow(false)}
    >
      <div
        className="flex flex-col relative w-4/5 h-full md:h-auto ml-auto bg-white shadow-[inset_-4px_-4px_4px_0_rgb(0,0,0,0.10)]"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="w-min pt-1 pl-1" onClick={() => setShow(false)}>
          <AiOutlineClose size={30} />
        </button>
        <div className="w-[95%] mx-auto">
          <h1>Cart Summary</h1>
          <div>
            <div className="grid grid-cols-9 text-lg font-semibold bg-black text-white">
              <div className="col-span-2 pl-1">Name</div>
              <div className="col-span-2">Option</div>
              <div>Price</div>
              <div className="col-span-2 text-center">Qty</div>
              <div>Total</div>
            </div>
          </div>
          {cart && cart.cartItems.length > 0 ? (
            <>
              {cart.cartItems.map((cartItem: CartItem) => {
                return <CItem cartId={cart.id} cartItem={cartItem} mutate={mutate} />;
              })}
              <div className="border-b-2 border-black"></div>
              <div className="grid grid-cols-9 font-bold">
                <div className="col-span-2">Total</div>
                <div className="col-span-2"></div>
                <div></div>
                <div className="col-span-2"></div>
                <div>${cart.cartTotal}</div>
              </div>
            </>
          ) : (
            <div>Cart is empty.</div>
          )}
          <div className="w-2/5 mx-auto">
            <Link className=" bg-green-600 text-white rounded-xl px-2 py-1 " href="/user/checkout" onClick={() => setShow(false)}>
              Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function CItem({ cartId, cartItem, mutate }: { cartId: number; cartItem: CartItem; mutate: KeyedMutator<any> }) {
  const decrement = async (itemId, quantity) => {
    await fetch("/decrement-quantity", {
      method: "POST",
      body: JSON.stringify({ cartId, itemId, quantity }),
    });
    mutate();
  };
  const increment = async (itemId) => {
    await fetch("/increment-quantity", {
      method: "POST",
      body: JSON.stringify({ cartId, itemId }),
    });
    mutate();
  };
  const deleteCartItem = async (itemId) => {
    await fetch(`/remove-from-cart/${itemId}`, { method: "DELETE" });
    mutate();
  };
  return (
    <div className="grid grid-cols-9 py-2 text-base even:bg-slate-200 items-center ">
      <div className="col-span-2 pl-1">{cartItem.productName}</div>
      <div className="col-span-2">{cartItem.variantName ? cartItem.variantName : ""}</div>
      <div>${cartItem.price}</div>
      <div className="flex items-center mx-auto col-span-2">
        <button className="w-min" onClick={() => decrement(cartItem.id, cartItem.quantity)} disabled={cartItem.quantity === 1}>
          <BsDashCircleFill color="red" size={14} />
        </button>
        <span className="w-min px-1">x{cartItem.quantity}</span>
        <button className="w-min " onClick={() => increment(cartItem.id)}>
          <BsPlusCircleFill color="green" size={14} />
        </button>
      </div>
      <div>${cartItem.price * cartItem.quantity}</div>
      <button onClick={() => deleteCartItem(cartItem.id)}>
        <BsFillTrashFill />
      </button>
    </div>
  );
}
