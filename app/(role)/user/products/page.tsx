import prisma from "lib/prisma";
import React from "react";
import { ProductPage } from "./ProductsClient";

export default async function ProductsPage() {
  const categories = await prisma.category.findMany({});

  return <ProductPage categories={categories} />;
}
