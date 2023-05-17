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
  return (
    <div className="h-full w-[90%] mx-auto">
      <h1 className="text-3xl font-bold pb-5">Products</h1>
      <div className="px-2 py-5 border-2 border-black bg-white rounded-xl shadow-xl">
        <ProductForm mutate={productsMutate} />
        <div className="border-b-[1px] border-gray-400 my-5"></div>

        <div className="flex flex-row md:gap-20 h-full">
          <div className="w-full">
            <ProductTable
              data={productsData}
              isLoading={isLoading}
              setProduct={setProduct}
              categoriesData={categoriesData}
              setCategory={setCategory}
            />
          </div>
          {product ? (
            <ProductDetails product={product} setProduct={setProduct} mutate={productsMutate} categoriesData={categoriesData} />
          ) : null}
          <div className="flex flex-col"></div>
        </div>
      </div>
    </div>
  );
}
