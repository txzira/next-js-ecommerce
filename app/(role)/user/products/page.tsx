import prisma from "lib/prisma";
import React from "react";
import { ProductPage } from "./Products";

export default async function ProductsPage() {
  const wallets = await prisma.walletAddress.findMany({
    where: { active: true },
    select: { id: true, address: true, type: { select: { name: true } } },
  });
  const categories = await prisma.category.findMany({});
  console.log(categories);

  return (
    <div className="h-full pb-5 ">
      <ProductPage wallets={wallets} categories={categories} />
    </div>
  );
}
