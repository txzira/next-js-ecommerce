import prisma from "lib/prisma";
import React from "react";
import { ProductPage } from "./Products";

export default async function ProductsPage() {
  const categories = await prisma.category.findMany({});

  return (
    <div className="h-full pb-5 ">
      <ProductPage categories={categories} />
    </div>
  );
}
