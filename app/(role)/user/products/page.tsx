import prisma from "lib/prisma";
import React from "react";
import { ProductTable } from "./Product";

export default async function ProductsPage() {
  const wallets = await prisma.walletAddress.findMany({
    where: { active: true },
    select: { address: true, type: { select: { name: true } } },
  });

  return (
    <div>
      <div>
        <h1 className="text-lg">Wallet Addresses</h1>
        <span className="text-sm">Note: Send payment to one of these addresses.</span>
        {wallets.map((wallet) => {
          return (
            <div className="flex flex-row gap-6">
              <div>{wallet.type.name}</div>
              <div>{wallet.address} </div>
            </div>
          );
        })}
      </div>
      <h1 className="text-center py-6">Products</h1>
      <ProductTable />
    </div>
  );
}
