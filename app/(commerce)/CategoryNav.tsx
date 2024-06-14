import { Product } from "@prisma/client";
import prisma from "lib/prisma";
import Link from "next/link";
import React from "react";

const CategoryNav = async () => {
  const categories = await prisma.category.findMany({
    where: { parentId: null, product: { some: { active: true } } },
  });

  return (
    <nav className="w-1/12">
      <ul>
        <li>
          <Link href="/products">Products</Link>
        </li>
        {categories.map((category) => {
          return (
            <li key={category.id}>
              <Link href={`/categories/${category.slug}`}>{category.name}</Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default CategoryNav;
