"use client";
import React, { useEffect } from "react";
import { CategoryList, CategoryCreateForm } from "./Categories";
import useSWR, { mutate } from "swr";
import { useQuery } from "@tanstack/react-query";

function getCategories() {
  return fetch("/admin/categories/get-categories", { method: "GET" }).then((res) => res.json());
}

export default function AdminCategoryPage() {
  const fetcher = (url) => fetch(url).then((res) => res.json());
  const { status, error: err, data: categories } = useQuery({ queryKey: ["categories"], queryFn: getCategories });
  console.log(categories);
  const {
    data: categoriesData,
    error,
    isLoading,
    mutate,
  } = useSWR("/admin/categories/get-categories", fetcher, { revalidateOnMount: true });

  return (
    <div className="h-full w-[90%] mx-auto">
      <h1 className="text-3xl font-bold pb-5">Categories</h1>
      <div className="px-2 py-5 border-2 border-black bg-white rounded-xl shadow-xl">
        <CategoryCreateForm categoriesData={categoriesData} categoriesMutate={mutate} />
        <div className="border-b-[1px] border-gray-400 my-5"></div>
        <CategoryList categoriesData={categoriesData} categoriesMutate={mutate} />
      </div>
    </div>
  );
}
