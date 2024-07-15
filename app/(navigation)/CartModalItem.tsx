import { useCartState } from "app/CartProvider";
import { USDollar, capitalizeFirstLetter } from "lib/utils";
import Image from "next/image";
import React from "react";
import { BsFillTrashFill } from "react-icons/bs";
import { CartItemProps } from "types/product";

const CartModalItem = ({ cartItem }: { cartItem: CartItemProps }) => {
  const { removeFromCart } = useCartState();
  return (
    <div className="flex flex-row items-center gap-5 py-2  even:bg-slate-200 ">
      <div className="relative h-32 w-32">
        <Image
          className="object-contain"
          src={cartItem.image}
          fill
          alt="Cart Item Image"
        />
      </div>
      <div className="flex-1">
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
      <button className="ml-auto" onClick={() => removeFromCart(cartItem)}>
        <BsFillTrashFill />
      </button>
    </div>
  );
};

export default CartModalItem;
