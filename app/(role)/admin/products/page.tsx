"use client";
import React, { useState } from "react";
import { ProductCategoryPortal, ProductDetails, ProductForm, ProductTable } from "./Products";
import useSWR from "swr";
import { Product } from "@prisma/client";

export default function AdminProductsPage() {
  const fetcher = (url) => fetch(url).then((res) => res.json());

  const [category, setCategory] = useState("All");
  const [product, setProduct] = useState<Product>();
  const { data: productsData, error, isLoading, mutate } = useSWR(`/admin/products/get-products/${category}`, fetcher);

  console.log(productsData);
  const {
    data: categoriesData,
    error: categoriesError,
    isLoading: categoriesIsLoading,
    mutate: categoriesMutate,
  } = useSWR(`/admin/products/get-categories`, fetcher);

  return (
    <div className="flex flex-col gap-5 h-full">
      <ProductCategoryPortal />
      <div className="border-b-[1px] border-slate-600"></div>

      <ProductForm mutate={mutate} />

      <div className="border-b-[1px] border-slate-600"></div>

      <div className="flex flex-row md:gap-20 h-full">
        <div className="w-1/2">
          <ProductTable
            data={productsData}
            isLoading={isLoading}
            setProduct={setProduct}
            categoriesData={categoriesData}
            category={category}
            setCategory={setCategory}
          />
        </div>
        <div className="border-l-[1px] border-slate-600"></div>
        <div className="flex flex-col">
          <h1 className="text-4xl font-bold pb-5">Product Information</h1>
          {product ? (
            <ProductDetails product={product} setProduct={setProduct} mutate={mutate} typesData={categoriesData} />
          ) : (
            <div>Click on a product to edit information</div>
          )}
        </div>
      </div>
    </div>
  );
}
