"use client";
import React, { useEffect, useState } from "react";

import { useSession } from "next-auth/react";
import useSWR from "swr";
import Image from "next/image";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Loader from "app/Loader";

function Product({ product }) {
  const [quantity, setQuantity] = useState(0);
  return (
    <div className="grid grid-cols-3 text-sm md:text-base">
      <input hidden name="id" value={product.id} />
      <div className="">
        <input className="px-2 w-full text-center bg-inherit focus:outline-none" type="text" name="name" value={product.name} readOnly />
      </div>
      <div className="">
        <input
          className="px-2 w-full text-center bg-inherit focus:outline-none"
          type="number"
          name="price"
          value={product.price}
          readOnly
        />
      </div>
      <div className="">
        <input
          className="px-2 w-full text-center bg-white border-b-[1px] border-l-[1px]  border-black"
          type="number"
          name="quantity"
          value={quantity}
          onChange={(event) => setQuantity(parseInt(event.target.value))}
        />
      </div>
    </div>
  );
}

export function ProductTable({
  wallets,
}: {
  wallets: {
    id: number;
    address: string;
    type: {
      name: string;
    };
  }[];
}) {
  const [image, setImage] = useState<any>();
  const [imageName, setImageName] = useState("");
  const { data: session, status } = useSession();
  const fetcher = (url) => fetch(url).then((res) => res.json());
  const { data, error, isLoading } = useSWR("/api/admin/product/get-products", fetcher);
  const router = useRouter();

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

  async function submitForm(event) {
    event.preventDefault();
    const ids: any = document.getElementsByName("id");
    const names: any = document.getElementsByName("name");
    const prices: any = document.getElementsByName("price");
    const quantities: any = document.getElementsByName("quantity");
    const cart = [];
    for (let i = 0; i < prices.length; i++) {
      if (quantities[i].value > 0) {
        cart.push({
          id: ids[i].value,
          name: names[i].value,
          price: prices[i].value,
          quantity: quantities[i].value,
          pricePaidPer: prices[i].value,
        });
      }
    }
    let orderResponse: any = await fetch("/api/customer/order/create-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cart, customerId: session.user.id, imagePath: image, imageName: imageName }),
    });
    orderResponse = await orderResponse.json();
    if (orderResponse.status === "ok") {
      toast.success(orderResponse.message);
      router.push("/");
    } else toast.error(orderResponse.message);
  }

  return (
    <>
      <h1 className="text-center py-6 text-base md:text-2xl  font-semibold">Products</h1>
      <form className="flex flex-col w-5/6 md:w-2/5 items-center mx-auto justify-center gap-4" id="order" onSubmit={submitForm}>
        <div className="w-full border-black border-2">
          <div className="grid grid-cols-3 font-bold text-sm md:text-base text-center bg-black text-white">
            <div className="md:px-2">Name</div>
            <div className="md:px-2">Price</div>
            <div className="md:px-2">Quanity</div>
          </div>
          {!isLoading ? (
            data.products.map((product) => {
              return <Product key={product.id} product={product} />;
            })
          ) : (
            <div>
              <Loader />
            </div>
          )}
        </div>
        <div>
          <h2 className="text-2xl font-semibold">Payment</h2>
        </div>
        <div>
          <h3 className="text-lg font-semibold">Wallet Addresses</h3>
          {wallets.length > 0 ? (
            wallets.map((wallet) => {
              return (
                <div key={wallet.id} className="flex flex-row gap-6">
                  <div>{wallet.type.name}</div>
                  <div>{wallet.address} </div>
                </div>
              );
            })
          ) : (
            <div>Admin has not set wallet address(es)</div>
          )}
          <span className="text-sm">
            Note: Send payment to one of these addresses. Screenshot the transaction between your wallet address and one of these addresses
            and attach it as your proof of payment image.
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
          <div className="text-sm">
            <p>Fabian P.</p>
            <p>325 N Larchmont Blvd, Los Angeles, CA 90004</p>
          </div>
        </div>
        <p>ORDERS WILL NOT SHIP UNTIL PAYMENT IS RECEIVED/VERIFIED.</p>
        <button className="bg-blue-900 text-white rounded-2xl px-3 py-1" type="submit">
          Submit Order
        </button>
      </form>
    </>
  );
}
