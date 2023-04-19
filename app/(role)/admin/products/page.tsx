"use client";
import React, { useState } from "react";
import { ProductDetails, ProductForm, ProductTable } from "./Products";
import useSWR from "swr";
import { Product } from "@prisma/client";

export default function AdminProductsPage() {
  const fetcher = (url) => fetch(url).then((res) => res.json());

  const [category, setCategory] = useState("All");
  const [product, setProduct] = useState<Product>();
  const [showProductDetails, setShowProductDetails] = useState(false);

  const { data: productsData, error, isLoading, mutate: productsMutate } = useSWR(`/admin/products/get-products/${category}`, fetcher);

  console.log(productsData);
  const {
    data: categoriesData,
    error: categoriesError,
    isLoading: categoriesIsLoading,
    mutate: categoriesMutate,
  } = useSWR(`/admin/categories/get-categories`, fetcher);
  console.log(categoriesData);
  return (
    <div className="flex flex-col gap-5 h-full">
      <ProductForm mutate={productsMutate} />

      <div className="border-b-[1px] border-slate-600"></div>

      <div className="flex flex-row md:gap-20 h-full">
        <div className="w-full">
          <ProductTable
            data={productsData}
            isLoading={isLoading}
            setProduct={setProduct}
            categoriesData={categoriesData}
            category={category}
            setCategory={setCategory}
            mutate={productsMutate}
            setShow={setShowProductDetails}
          />
        </div>
        {showProductDetails ? (
          <ProductDetails
            product={product}
            setProduct={setProduct}
            setShow={setShowProductDetails}
            mutate={productsMutate}
            categoriesData={categoriesData}
          />
        ) : null}
        <div className="flex flex-col"></div>
      </div>
    </div>
  );
}
