"use client";
import React, { useState } from "react";
// import { ProductDetails, ProductForm, ProductTable } from "./(components)/Product";
import useSWR from "swr";
import { Category, Product } from "@prisma/client";
import { IoMdAdd } from "react-icons/io";
import Link from "next/link";
import { AiOutlineSearch } from "react-icons/ai";

export default function AdminProductsPage() {
  //   const [category, setCategory] = useState("All");
  //   const [product, setProduct] = useState<
  //     Product & {
  //       category: Category;
  //     }
  //   >();
  //   const [showProductDetails, setShowProductDetails] = useState(false);

  //   const {
  //     data: productsData,
  //     error: productsError,
  //     isLoading: productsIsLoading,
  //     mutate: productsMutate,
  //   } = useSWR<
  //     (Product & {
  //       category: Category;
  //     })[]
  //   >("/admin/products/api/get-products", (url) =>
  //     fetch(url).then((res) => res.json())
  //   );

  //   const {
  //     data: categoriesData,
  //     error: categoriesError,
  //     isLoading: categoriesIsLoading,
  //     mutate: categoriesMutate,
  //   } = useSWR<Category[]>(`/admin/categories/api/get-categories`, (url) =>
  //     fetch(url).then((res) => res.json())
  //   );
  return (
    <div className="mx-auto h-full w-[90%]">
      <div className="flex flex-row items-center justify-between pb-5">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link
          href="/admin/products/add"
          className="flex flex-row items-center rounded-full bg-green-500 px-3 py-1.5 text-[10px] tracking-widest text-white ">
          <IoMdAdd size={14} />
          <span>ADD</span>
        </Link>
      </div>
      <div className="rounded-xl border-2 border-black bg-white px-2 py-5 shadow-xl">
        <div className="flex h-12 flex-row items-center gap-2 rounded-lg border p-2">
          <AiOutlineSearch />
          <input
            type="text"
            className="w-full focus:outline-none"
            placeholder="Search"
          />
        </div>
        <div className="my-5 border-b-[1px] border-gray-400"></div>

        {/* <div className="flex h-full flex-row md:gap-20">
          <ProductTable
            productsData={productsData}
            productsIsLoading={productsIsLoading}
            setProduct={setProduct}
            categoriesData={categoriesData}
            setCategory={setCategory}
          />
          {product ? (
            <ProductDetails
              product={product}
              setProduct={setProduct}
              productsMutate={productsMutate}
              categoriesData={categoriesData}
            />
          ) : null}
        </div> */}
      </div>
    </div>
  );
}
