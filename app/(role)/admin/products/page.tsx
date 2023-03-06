"use client";
import { Product } from "@prisma/client";
import React, { FormEvent, useState } from "react";
import Image from "next/image";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function AdminProductsPage() {
  return (
    <div>
      Admin Products Page
      <ProductForm />
      <ProductTable />
    </div>
  );
}

function ProductForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  async function submitForm(event) {
    event.preventDefault();

    const response = await fetch("/api/admin/product/create-product", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, price }),
    });
    const data = await response.json();
    data.status === "ok" ? toast.success(data.message) : toast.error(data.message);
    console.log(data);
    setName("");
    setPrice("");
    router.refresh();
  }

  return (
    <form onSubmit={submitForm}>
      <label htmlFor="name">Name</label>
      <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} />
      <label htmlFor="price">Price</label>
      <input type="number" id="price" value={price} onChange={(e) => setPrice(e.target.value)} />
      <button type="submit">Add Product</button>
    </form>
  );
}

function ProductTable() {
  const fetcher = (url) => fetch(url).then((res) => res.json());
  // const { data, error, isLoading } = useSWR("/api/admin/product/get-product?limit=10&page=0&sortId=asc", fetcher);
  const { data, error, isLoading } = useSWR("/api/admin/product/get-products", fetcher);
  if (data) {
    console.log(data.products);
  }
  console.log(isLoading);
  return (
    <table>
      <tr>
        <th className="px-2">Id</th>
        <th className="px-2">Name</th>
        <th className="px-2">Price</th>
      </tr>
      {data
        ? data.products.map((product) => {
            return (
              <tr key={product.id}>
                <td className="px-2">{product.id}</td>
                <td className="px-2">{product.name}</td>
                <td className="px-2">{product.price.toString()}</td>
              </tr>
            );
          })
        : null}
      <tr></tr>
    </table>
  );
}
