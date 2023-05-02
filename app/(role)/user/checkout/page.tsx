"use client";
import { Cart, CartItem } from "@prisma/client";
import Loader from "app/Loader";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import useSWR, { KeyedMutator } from "swr";
import states from "lib/state";
import Image from "next/image";

export default function CheckoutPage() {
  const initialShipping = { firstName: "", lastName: "", streetAddress: "", streetAddress2: "", city: "", state: "AL", zipCode: "" };

  const [shipping, setShipping] = useState(initialShipping);
  const fetcher = (url) => fetch(url).then((res) => res.json());
  const { data, error, isLoading, mutate } = useSWR("/get-cart", fetcher);
  const [cart, setCart] = useState<
    Cart & {
      cartItems: CartItem[];
    }
  >(null);

  const [image, setImage] = useState<any>();
  const [imageName, setImageName] = useState("");
  useEffect(() => {
    if (data) {
      setCart(data.cart);
    }
  }, [data]);

  console.log(cart);
  const placeOrder = async () => {
    console.log("lol");
    const data = await fetch("/user/checkout/place-order", { method: "POST", body: JSON.stringify({ cartId: cart.id, shipping }) });
    const response = await data.json();
    console.log(response);
  };
  return (
    <div className="pb-10">
      <ShippingForm shipping={shipping} setShipping={setShipping} />
      <ProductForm image={image} setImage={setImage} setImageName={setImageName} />
      <div className="w-[90%] mx-auto bg-white rounded-xl shadow-lg p-2">
        <h1 className="pb-3 text-xl font-bold ">Order Review</h1>
        <div className="grid grid-cols-5 bg-gray-300">
          <div className="col-span-2">Name</div>
          <div>Price</div>
          <div>Qty</div>
          <div>Total</div>
        </div>
        {cart ? (
          cart.cartItems.map((cartItem) => {
            return <CartItem cartItem={cartItem} mutate={mutate} />;
          })
        ) : (
          <Loader />
        )}
        <div className="grid grid-cols-5">
          <div className="col-span-2"></div>
          <div className="col-span-2 text-center">Total Amount</div>
          <div className="font-black">${cart ? cart.cartTotal : null}</div>
        </div>
        <div className="my-4">
          <div className="w-full border-b-[1px] border-gray-200"></div>
        </div>
        <div className="flex flex-row justify-end items-center gap-3">
          <Link href="/user/products" className="border-black border-[1px] text-[10px] font-medium col-span-2 p-2">
            CONTINUE SHOPPING
          </Link>
          <button className="bg-black text-white text-[10px] p-2 font-medium" onClick={placeOrder}>
            PLACE ORDER
          </button>
        </div>
      </div>
    </div>
  );
}
function CartItem({ cartItem, mutate }: { cartItem: CartItem; mutate: KeyedMutator<any> }) {
  const [quantity, setQuantity] = useState(cartItem.quantity);

  useEffect(() => {
    setQuantity(cartItem.quantity);
  }, [cartItem.quantity]);
  function listOfQuantities() {
    const quantities: number[] = [];

    for (let i = 1; i < 100; i++) {
      quantities.push(i);
    }
    return quantities;
  }
  const changeQuantity = async () => {
    await fetch("/user/checkout/change-quantity", {
      method: "POST",
      body: JSON.stringify({ cartItemId: cartItem.id, quantity, oldQuantity: cartItem.quantity }),
    });
    mutate();
  };
  return (
    <>
      <div className="grid grid-cols-5 h-14 items-center py-2">
        <div className="col-span-2">
          <p>{cartItem.productName}</p>
          {cartItem.variantName ? <p className="text-sm text-gray-500">Option: {cartItem.variantName}</p> : ""}
        </div>
        <div>${cartItem.price}</div>
        <div className="relative flex flex-col">
          <select className="w-max " value={quantity} onChange={(event) => setQuantity(Number(event.target.value))}>
            {listOfQuantities().map((quantity) => {
              return <option value={quantity}>{quantity}</option>;
            })}
          </select>
          <button className="absolute top-6 text-xs underline text-blue-600" onClick={() => changeQuantity()}>
            Update
          </button>
        </div>
        <div className="font-medium">${cartItem.price * cartItem.quantity}</div>
      </div>
      <div className="my-4">
        <div className="w-full border-b-[1px] border-gray-200"></div>
      </div>
    </>
  );
}

function ShippingForm({
  shipping,
  setShipping,
}: {
  shipping: {
    firstName: string;
    lastName: string;
    streetAddress: string;
    streetAddress2: string;
    city: string;
    state: string;
    zipCode: string;
  };
  setShipping: React.Dispatch<
    React.SetStateAction<{
      firstName: string;
      lastName: string;
      streetAddress: string;
      streetAddress2: string;
      city: string;
      state: string;
      zipCode: string;
    }>
  >;
}) {
  return (
    <div className="w-[90%] mx-auto bg-white rounded-xl shadow-lg p-2">
      <div className="w-full mx-auto">
        <h2 className="text-2xl font-semibold pb-2">Shipping</h2>
        <div className="flex flex-row">
          <div className="flex flex-col">
            <label className="font-semibold text-base md:text-lg" htmlFor="firstName">
              First Name
            </label>
            <input
              required={true}
              className="text-sm md:text-base"
              id="firstName"
              value={shipping.firstName}
              placeholder="John"
              onChange={(event) => setShipping({ ...shipping, firstName: event.target.value })}
            />
          </div>
          <div className="flex flex-col">
            <label className="font-semibold text-base md:text-lg" htmlFor="lastName">
              Last Name
            </label>
            <input
              required={true}
              className="text-sm md:text-base"
              id="lastName"
              value={shipping.lastName}
              placeholder="Smith"
              onChange={(event) => setShipping({ ...shipping, lastName: event.target.value })}
            />
          </div>
        </div>

        <div className="flex flex-row">
          <div className="flex flex-col">
            <label className="font-semibold text-base md:text-lg" htmlFor="streetAddress">
              Street Address
            </label>
            <input
              required={true}
              className="text-sm md:text-base"
              id="streetAddress"
              value={shipping.streetAddress}
              placeholder="123 Rainy St."
              onChange={(event) => setShipping({ ...shipping, streetAddress: event.target.value })}
            />
          </div>
          <div className="flex flex-col">
            <label className="font-semibold text-base md:text-lg" htmlFor="streetAddress2">
              Street Address 2
            </label>
            <input
              className="text-sm md:text-base"
              id="streetAddress2"
              value={shipping.streetAddress2}
              placeholder="Apt. 2"
              onChange={(event) => setShipping({ ...shipping, streetAddress2: event.target.value })}
            />
          </div>
        </div>

        <div className="flex flex-row">
          <div className="flex flex-col ">
            <label className="font-semibold text-base md:text-lg" htmlFor="city">
              City
            </label>
            <input
              required={true}
              className="text-sm md:text-base"
              id="city"
              value={shipping.city}
              placeholder="Beckley"
              onChange={(event) => setShipping({ ...shipping, city: event.target.value })}
            />
          </div>
          <div className="flex flex-col">
            <label className="font-semibold text-base md:text-lg" htmlFor="state">
              State
            </label>
            <select
              className="text-sm md:text-base"
              id="state"
              onChange={(event) => setShipping({ ...shipping, state: event.target.value })}
            >
              {states.map((state) => {
                return (
                  <option key={state.code} value={state.code}>
                    {state.name}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="flex flex-col">
            <label className="font-semibold text-base md:text-lg" htmlFor="zipCode">
              Zip
            </label>
            <input
              required={true}
              className="text-sm md:text-base"
              id="zipCode"
              value={shipping.zipCode}
              placeholder="25919"
              onChange={(event) => setShipping({ ...shipping, zipCode: event.target.value })}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
function ProductForm({ image, setImage, setImageName }) {
  const setFileToBase = (file) => {
    const reader = new FileReader();
    setImageName(file.name);
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImage(reader.result);
    };
  };
  const handleImage = (event) => {
    const file = event.target.files[0];
    setFileToBase(file);
  };
  return (
    <div className="w-[90%] mx-auto my-10 bg-white rounded-xl shadow-lg p-2">
      <div>
        <h2 className="text-2xl font-semibold pb-2">Payment</h2>

        <span className="text-xs md:text-sm">
          Note: Screenshot the transaction between your wallet address and one of these addresses and attach it as your proof of payment
          image, leave image blank if cash order.
        </span>
      </div>
      <span>
        <u className="font-semibold">Crypto Proof of Payment Image</u>
      </span>
      <div>
        <label htmlFor="productImage" className="text-sm">
          Select an Image:
        </label>
        <input type="file" id="productImage" onChange={handleImage} />
      </div>
      {image ? <Image id="preview" src={image} alt="payment preview" width={250} height={100} /> : null}
      <div className="w-full">
        <h3 className="text-lg font-semibold">Cash Address</h3>
        <span className="text-sm">If you wish to pay with cash, send it to the address below.</span>
        <div className="text-xs md:text-sm">
          <p>Fabian P.</p>
          <p>325 N Larchmont Blvd, Los Angeles, CA 90004</p>
        </div>
      </div>
      <p>ORDERS WILL NOT SHIP UNTIL PAYMENT IS RECEIVED/VERIFIED.</p>
    </div>
  );
}
