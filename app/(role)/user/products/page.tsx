import prisma from "lib/prisma";
import React from "react";
import { ProductTable } from "./Products";

export default async function ProductsPage() {
  const wallets = await prisma.walletAddress.findMany({
    where: { active: true },
    select: { id: true, address: true, type: { select: { name: true } } },
  });

  return (
    <div className="h-full pb-5 ">
      <ProductTable wallets={wallets} />
    </div>
  );
}
