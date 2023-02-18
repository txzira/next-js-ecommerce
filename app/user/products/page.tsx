"use client";
import React, { useState } from "react";
import useSWR from "swr";

function Product({ product }) {
  const [quantity, setQuantity] = useState(0);
  return (
    <tr>
      <td className="px-2">
        <input className="bg-inherit focus:outline-none" type="text" name="name" value={product.name} readOnly />
      </td>
      <td className="px-2">
        <input className="bg-inherit focus:outline-none" type="number" name="price" value={product.price} readOnly />
      </td>
      <td className="px-2">
        <input type="number" name="quantity" value={quantity} onChange={(event) => setQuantity(parseInt(event.target.value))} />
      </td>
    </tr>
  );
}

function ProductTable() {
  const fetcher = (url) => fetch(url).then((res) => res.json());
  const { data, error, isLoading } = useSWR("/api/admin/product/get-product", fetcher);

  async function submitForm(event) {
    event.preventDefault();
    const names: any = document.getElementsByName("name");
    const prices: any = document.getElementsByName("price");
    const quantities: any = document.getElementsByName("quantity");
    const cart = [];

    // const form = event.target;
    // const formFields = form.elements;
    for (let i = 0; i < prices.length; i++) {
      if (quantities[i].value > 0) {
        cart.push({ name: names[i].value, price: prices[i].value, quantity: quantities[i].value });
      }
      // console.log(formFields[i].value, formFields[i].name);
    }
    const order = await fetch("/api/customer/order/create-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cart }),
    });
    console.log(cart);
  }

  return (
    <form id="order" onSubmit={submitForm}>
      <table>
        <tr>
          <th className="px-2">Name</th>
          <th className="px-2">Price</th>
          <th className="px-2">Quanity</th>
        </tr>
        {data
          ? data.products.map((product) => {
              return <Product key={product.id} product={product} />;
            })
          : null}
        <tr></tr>
      </table>
      <button type="submit">Submit</button>
    </form>
  );
}

export default function ProductsPage() {
  return (
    <div>
      <h1>Products</h1>
      <ProductTable />
    </div>
  );
}
