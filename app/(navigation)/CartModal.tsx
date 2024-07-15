import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AiOutlineClose } from "react-icons/ai";
import { CartItemProps } from "types/product";
import { useCartState } from "app/CartProvider";
import CartModalItem from "./CartModalItem";

export default function CartModal({
  cart,
  cartTotal,
  setShow,
}: {
  cart: any;
  cartTotal: number;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const { getTotalItems } = useCartState();
  const onClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      setShow(false);
    }, 500);
  };

  useEffect(() => {
    setIsOpen(true);
  }, []);
  return (
    <div
      className="fixed left-0 right-0 top-0 z-50 flex h-full w-full overflow-y-scroll bg-black bg-opacity-50 md:inset-0 md:h-full  "
      onClick={() => onClose()}>
      <div
        className={` ${
          isOpen ? "right-0" : "-right-full"
        } relative ml-auto flex h-full w-5/6 flex-col bg-white shadow-[inset_-4px_-4px_4px_0_rgb(0,0,0,0.10)] transition-all duration-500 sm:w-1/4 md:h-auto`}
        onClick={(e) => e.stopPropagation()}>
        <button className="w-min pl-1 pt-1" onClick={() => onClose()}>
          <AiOutlineClose size={30} />
        </button>
        <div className="mx-auto w-[95%]">
          <h1>Your Cart ({getTotalItems()})</h1>
          {cart && cart?.length > 0 ? (
            <>
              {cart.map((cartItem: CartItemProps) => {
                return <CartModalItem key={cartItem.id} cartItem={cartItem} />;
              })}
              <div className="border-b-2 border-black"></div>
              <div className="">
                <h1>Summary</h1>
                <div className="col-span-2">Total</div>
                <div className="col-span-2"></div>
                <div></div>
                <div className="col-span-2"></div>
                <div>${cartTotal}</div>
              </div>
            </>
          ) : (
            <div>Cart is empty.</div>
          )}
          <div className="mx-auto w-2/5">
            <Link
              className=" w-[420px] max-w-[50%] rounded-full bg-[#3f51b5] px-2 py-1 text-white "
              href="/checkout"
              onClick={() => onClose()}>
              Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
