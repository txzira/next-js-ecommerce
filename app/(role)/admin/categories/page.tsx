"use client";
import React, { useEffect } from "react";
import { CategoryList, CategoryCreateForm } from "./Categories";
import useSWR from "swr";
import { Category } from "@prisma/client";
import Link from "next/link";
import { IoMdAdd } from "react-icons/io";
import { AiOutlineSearch } from "react-icons/ai";

export default function AdminCategoryPage() {
  const {
    data: categoriesData,
    error: categoriesError,
    isLoading: categoriesIsLoading,
    mutate: categoriesMutate,
  } = useSWR<Category[]>(
    "/admin/categories/api/get-categories",
    (url: string) => fetch(url).then((res) => res.json())
  );
  return (
    <div className="mx-auto h-full w-[90%]">
      <div className="flex flex-row items-center justify-between pb-5">
        <h1 className="text-2xl font-bold">Categories</h1>
        <Link
          href="/admin/categories/add"
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
        {/* <CategoryCreateForm categoriesMutate={categoriesMutate} /> */}
        <div className="my-5 border-b-[1px] border-gray-400"></div>
        <CategoryList
          categoriesData={categoriesData}
          categoriesIsLoading={categoriesIsLoading}
          categoriesMutate={categoriesMutate}
        />
      </div>
    </div>
  );
}
