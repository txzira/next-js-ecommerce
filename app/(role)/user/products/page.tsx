"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import Image from "next/image";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

function Product({ product }) {
  const [quantity, setQuantity] = useState(0);
  return (
    <tr>
      <input hidden name="id" value={product.id} />
      <td className="">
        <input className="px-2 w-full text-center bg-inherit focus:outline-none" type="text" name="name" value={product.name} readOnly />
      </td>
      <td className="">
        <input
          className="px-2 w-full text-center bg-inherit focus:outline-none"
          type="number"
          name="price"
          value={product.price}
          readOnly
        />
      </td>
      <td className="">
        <input
          className="px-2 w-full text-center bg-white border-b-[1px] border-l-[1px]  border-black"
          type="number"
          name="quantity"
          value={quantity}
          onChange={(event) => setQuantity(parseInt(event.target.value))}
        />
      </td>
    </tr>
  );
}

function ProductTable() {
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
        cart.push({ id: ids[i].value, name: names[i].value, price: prices[i].value, quantity: quantities[i].value });
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
    <form className="flex flex-col w-2/5 items-center mx-auto justify-center gap-4" id="order" onSubmit={submitForm}>
      <table className="w-full table-fixed border-black border-2">
        <tr>
          <th className="px-2 text-center bg-black text-white">Name</th>
          <th className="px-2 text-center bg-black text-white">Price</th>
          <th className="px-2 text-center bg-black text-white">Quanity</th>
        </tr>
        {data
          ? data.products.map((product) => {
              return <Product key={product.id} product={product} />;
            })
          : null}
        <tr></tr>
      </table>
      <span>
        <u>Proof of Payment Image</u>
      </span>
      <div>
        <label htmlFor="productImage">Select an Image:</label>
        <input type="file" id="productImage" onChange={handleImage} />
      </div>
      {image ? <Image id="preview" src={image} alt="payment preview" width={250} height={100} /> : null}
      <button className="bg-blue-900 text-white rounded-2xl px-3 py-1" type="submit">
        Submit Order
      </button>
    </form>
  );
}

export default function ProductsPage() {
  return (
    <div>
      <h1 className="text-center py-6">Products</h1>
      <ProductTable />
    </div>
  );
}
