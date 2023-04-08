"use client";
import React, { useState } from "react";
import { ProductDetails, ProductForm, ProductTable } from "./Products";
import useSWR from "swr";
import { Product } from "@prisma/client";

export default function AdminProductsPage() {
  const fetcher = (url) => fetch(url).then((res) => res.json());
  const [category, setCategory] = useState("All");

  const { data, error, isLoading, mutate } = useSWR(`/admin/products/get-products/${category}`, fetcher);
  const [product, setProduct] = useState<Product>();
  console.log(data);
  const {
    data: typesData,
    error: typesError,
    isLoading: typesIsLoading,
    mutate: productTypesMutate,
  } = useSWR(`/admin/products/get-product-types`, fetcher);

  return (
    <div className="flex flex-col gap-5 h-full">
      <div>
        <ProductForm mutate={mutate} />
      </div>
      <div className="border-b-[1px] border-slate-600"></div>

      <div className="flex flex-row md:gap-20 h-full">
        <div className="w-1/2">
          <h1 className="text-4xl font-bold pb-5">Products</h1>
          <div className="flex flex-row">
            <div className="mr-2">Categories:</div>
            <div>
              <button
                className={`px-2 ${category === "All" ? "bg-black text-white" : "hover:bg-black hover:text-white"} `}
                onClick={() => setCategory("All")}
              >
                All
              </button>
              {typesData &&
                typesData.productTypes.map((type) => {
                  return (
                    <button
                      className={`px-2 ${category === type.name ? "bg-black text-white" : "hover:bg-black hover:text-white"} `}
                      onClick={() => setCategory(type.name)}
                    >
                      {type.name}
                    </button>
                  );
                })}
            </div>
          </div>
          <ProductTable data={data} isLoading={isLoading} setProduct={setProduct} />
        </div>
        <div className="border-l-[1px] border-slate-600"></div>
        <div className="flex flex-col">
          <h1 className="text-4xl font-bold pb-5">Product Information</h1>
          {product ? (
            <ProductDetails product={product} setProduct={setProduct} mutate={mutate} typesData={typesData} />
          ) : (
            <div>Click on a product to edit information</div>
          )}
        </div>
      </div>
    </div>
  );
}
