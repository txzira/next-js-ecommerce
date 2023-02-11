"use client";
import React, { useState } from "react";
import useSWR from "swr";

function Product({ product }) {
  const [quantity, setQuantity] = useState(0);
  return (
    <tr id="product">
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
  const { data, error, isLoading } = useSWR("/api/admin/product/get-product?limit=10&page=0&sortId=asc", fetcher);
  function submitForm(event) {
    event.preventDefault();
    const names: any = document.getElementsByName("name");
    const prices: any = document.getElementsByName("price");
    const quantities: any = document.getElementsByName("quantity");

    // const form = event.target;
    // const formFields = form.elements;
    for (let i = 0; i < prices.length; i++) {
      console.log(names[i].value);
      console.log(prices[i].value);
      console.log(quantities[i].value);
      // console.log(formFields[i].value, formFields[i].name);
    }
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
              return <Product product={product} />;
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
