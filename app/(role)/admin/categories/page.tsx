"use client";
import React from "react";
import { CategoryList, CategoryCreateForm } from "./Categories";
import useSWR from "swr";

export default function AdminCategoryPage() {
  const fetcher = async (url) => fetch(url).then((res) => res.json());
  const { data: categoriesData, error, isLoading, mutate: categoriesMutate } = useSWR("/admin/categories/get-categories", fetcher);
  return (
    <div className="h-full w-[90%] mx-auto">
      <h1 className="text-3xl font-bold pb-5">Categories</h1>
      <div className="px-2 py-5 border-2 border-black bg-white rounded-xl shadow-xl">
        <CategoryCreateForm categoriesMutate={categoriesMutate} />
        <div className="border-b-[1px] border-gray-400 my-5"></div>
        <CategoryList categoriesData={categoriesData} categoriesMutate={categoriesMutate} />
      </div>
    </div>
  );
}
