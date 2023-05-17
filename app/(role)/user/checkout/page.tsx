"use client";
import { Cart, CartItem, WalletAddress, WalletType } from "@prisma/client";
import Loader from "app/Loader";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import useSWR, { KeyedMutator } from "swr";
import states from "lib/state";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const fetcher = (url) => fetch(url).then((res) => res.json());
  const initialShipping = { firstName: "", lastName: "", streetAddress: "", streetAddress2: "", city: "", state: "AL", zipCode: "" };
  const { data: cartData, error: cartError, isLoading: cartIsLoading, mutate: cartMutate } = useSWR("/get-cart", fetcher);
  const router = useRouter();
  const {
    data: walletsData,
    error: walletsError,
    isLoading: walletsIsLoading,
    mutate: walletsMutate,
  } = useSWR("/user/checkout/get-wallet-address", fetcher);

  const [shipping, setShipping] = useState(initialShipping);
  const [cart, setCart] = useState<
    Cart & {
      cartItems: CartItem[];
    }
  >(null);
  const [image, setImage] = useState<any>();
  const [imageName, setImageName] = useState("");

  useEffect(() => {
    if (cartData) {
      setCart(cartData.cart);
    }
  }, [cartData]);

  console.log(cart);
  const placeOrder = async () => {
    toast.loading("Loading...");
    const data = await fetch("/user/checkout/place-order", {
      method: "POST",
      body: JSON.stringify({ cartId: cart.id, shipping, imagePath: image, imageName }),
    });
    const response = await data.json();
    toast.dismiss();
    if (response.status === 200) {
      toast.success(response.message);
      router.push("/user/products");
    } else {
      toast.error(response.message);
      router.push("/user/products");
    }
  };
  return cart && cart.cartItems.length > 0 ? (
    <div className="pb-10 mt-8 ">
      <ShippingForm shipping={shipping} setShipping={setShipping} />
      <PaymentForm
        image={image}
        setImage={setImage}
        walletsData={walletsData}
        walletsIsLoading={walletsIsLoading}
        setImageName={setImageName}
      />
      <OrderReview cart={cart} mutate={cartMutate} placeOrder={placeOrder} />
    </div>
  ) : (
    <div className="flex justify-center mt-8">
      <p className="text-lg">
        Cart Empty. To add items{" "}
        <Link href="/user/products" className="text-blue-800 underline">
          click here
        </Link>
        .
      </p>
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
              return (
                <option key={quantity} value={quantity}>
                  {quantity}
                </option>
              );
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
    <div className="bg-white rounded-xl shadow-lg p-2">
      <div className="w-full mx-auto">
        <h1 className="text-2xl font-bold pb-2">Shipping</h1>
        {/* // First and Last Name row */}
        <div className="flex flex-row gap-1">
          <div className="flex flex-col w-[49%]">
            <label className="font-semibold text-base md:text-lg" htmlFor="firstName">
              First Name
            </label>
            <input
              required={true}
              className="px-1 text-sm md:text-base"
              id="firstName"
              value={shipping.firstName}
              placeholder="John"
              onChange={(event) => setShipping({ ...shipping, firstName: event.target.value })}
            />
          </div>
          <div className="flex flex-col w-[49%]">
            <label className="font-semibold text-base md:text-lg" htmlFor="lastName">
              Last Name
            </label>
            <input
              required={true}
              className="px-1 text-sm md:text-base"
              id="lastName"
              value={shipping.lastName}
              placeholder="Smith"
              onChange={(event) => setShipping({ ...shipping, lastName: event.target.value })}
            />
          </div>
        </div>
        {/* // Street Address row */}
        <div className="flex flex-row gap-1">
          <div className="flex flex-col w-[59%]">
            <label className="font-semibold text-base md:text-lg" htmlFor="streetAddress">
              Street Address
            </label>
            <input
              required={true}
              className="px-1 text-sm md:text-base"
              id="streetAddress"
              value={shipping.streetAddress}
              placeholder="123 Rainy St."
              onChange={(event) => setShipping({ ...shipping, streetAddress: event.target.value })}
            />
          </div>
          <div className="flex flex-col w-[39%]">
            <label className="font-semibold text-base md:text-lg" htmlFor="streetAddress2">
              Street Address 2
            </label>
            <input
              className="px-1 text-sm md:text-base"
              id="streetAddress2"
              value={shipping.streetAddress2}
              placeholder="Apt. 2"
              onChange={(event) => setShipping({ ...shipping, streetAddress2: event.target.value })}
            />
          </div>
        </div>
        {/* // City State Zip row */}
        <div className="flex flex-row gap-1">
          <div className="flex flex-col w-[33%]">
            <label className="font-semibold text-base md:text-lg" htmlFor="city">
              City
            </label>
            <input
              required={true}
              className="px-1 text-sm md:text-base"
              id="city"
              value={shipping.city}
              placeholder="Beckley"
              onChange={(event) => setShipping({ ...shipping, city: event.target.value })}
            />
          </div>
          <div className="flex flex-col w-[33%]">
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
          <div className="flex flex-col w-[33%]">
            <label className="font-semibold text-base md:text-lg" htmlFor="zipCode">
              Zip
            </label>
            <input
              required={true}
              className="px-1 text-sm md:text-base"
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

function PaymentForm({ image, setImage, setImageName, walletsData, walletsIsLoading }) {
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
    <div className="my-10 bg-white rounded-xl shadow-lg p-2">
      <div>
        <h1 className="text-2xl font-bold pb-2">Payment</h1>
        <p className="text-xs md:text-sm">
          Note: Screenshot the transaction between your wallet address and one of these addresses and attach it as your proof of payment
          image, leave image blank if cash order.
        </p>

        <h1 className="text-xl font-semibold pt-3 pb-1">Wallet Addresses</h1>
        <div className="grid grid-cols-3 bg-black text-white text-lg">
          <div className="col-span-2 pl-2">Address</div>
          <div className="pl-2">Type</div>
        </div>
        <div className="h-24 overflow-y-scroll border-2 border-black">
          {!walletsIsLoading ? (
            walletsData.walletAddresses.map(
              (
                walletAddress: WalletAddress & {
                  type: WalletType;
                }
              ) => {
                return (
                  <div key={walletAddress.id} className="grid grid-cols-3 even:bg-slate-200">
                    <div className="col-span-2 pl-2 overflow-x-scroll">{walletAddress.address}</div>
                    <div className="pl-2">{walletAddress.type.name}</div>
                  </div>
                );
              }
            )
          ) : (
            <div className="flex justify-center">
              <Loader />
            </div>
          )}
        </div>
      </div>
      <p className="pt-2">
        <u className="font-semibold">Crypto Proof of Payment Image</u>
      </p>
      <div>
        <label htmlFor="productImage" className="text-sm">
          Select an Image:
        </label>
        <input type="file" id="productImage" onChange={handleImage} />
      </div>
      {image ? (
        <div className="flex justify-center w-80 h-80 relative object-contain mx-auto ">
          <Image id="preview" src={image} fill={true} alt="payment preview" />
        </div>
      ) : null}
      <div className="w-full">
        <h1 className="text-xl font-semibold">Cash Address</h1>
        <p className="text-sm">If you wish to pay with cash, send it to the address below.</p>
        <div className="py-2 text-xs md:text-sm">
          <p>Fabian P.</p>
          <p>325 N Larchmont Blvd, Los Angeles, CA 90004</p>
        </div>
      </div>
      <p className="text-center">ORDERS WILL NOT SHIP UNTIL PAYMENT IS RECEIVED/VERIFIED.</p>
    </div>
  );
}

function OrderReview({
  cart,
  mutate,
  placeOrder,
}: {
  cart: Cart & {
    cartItems: CartItem[];
  };
  mutate: KeyedMutator<any>;
  placeOrder: () => Promise<void>;
}) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-2">
      <h1 className="pb-3 text-2xl font-bold ">Order Review</h1>
      <div className="grid grid-cols-5 bg-black text-white">
        <div className="col-span-2 px-1">Name</div>
        <div className="px-1">Price</div>
        <div className="px-1">Qty</div>
        <div className="px-1">Total</div>
      </div>
      {cart ? (
        cart.cartItems.map((cartItem) => {
          return <CartItem key={cartItem.id} cartItem={cartItem} mutate={mutate} />;
        })
      ) : (
        <div className="flex justify-center">
          <Loader />
        </div>
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
        <Link href="/user/products" className="border-black  border-[1px] text-[10px] font-medium col-span-2 p-2">
          CONTINUE SHOPPING
        </Link>
        <button className="bg-green-600 text-white text-[10px] p-2 font-medium" onClick={placeOrder}>
          PLACE ORDER
        </button>
      </div>
    </div>
  );
}
