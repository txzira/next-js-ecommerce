"use client";
import React, { useState } from "react";
import { ProductDetails, ProductForm, ProductTable } from "./Products";
import useSWR from "swr";
import { Product } from "@prisma/client";

export default function AdminProductsPage() {
  const fetcher = (url) => fetch(url).then((res) => res.json());
  const { data, error, isLoading, mutate } = useSWR("/api/admin/product/get-products", fetcher);
  const [product, setProduct] = useState<Product>();
  console.log(data);

  return (
    <div className="flex flex-col gap-5 h-full">
      <div>
        <h1 className="text-4xl font-bold pb-5">Create Product</h1>
        <ProductForm mutate={mutate} />
      </div>
      <div className="border-b-[1px] border-slate-600"></div>

      <div className="flex flex-row md:gap-20 h-full">
        <div className="w-1/2">
          <h1 className="text-4xl font-bold pb-5">Products</h1>
          <ProductTable data={data} isLoading={isLoading} setProduct={setProduct} />
        </div>
        <div className="border-l-[1px] border-slate-600"></div>
        <div className="flex flex-col">
          <h1 className="text-4xl font-bold pb-5">Product Information</h1>
          {product ? (
            <ProductDetails product={product} setProduct={setProduct} mutate={mutate} />
          ) : (
            <div>Click on a product to edit information</div>
          )}
        </div>
      </div>
    </div>
  );
}
