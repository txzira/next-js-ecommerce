import NavLink from "app/(navigation)/NavLink";
import prisma from "lib/prisma";
import Link from "next/link";
import React from "react";

const CategoryNavLinks = async () => {
  const categories = await prisma.category.findMany({
    where: { parentId: null, product: { some: { active: true } } },
  });

  return (
    <>
      {categories.map((category) => {
        return (
          <NavLink key={category.id} href={`/categories/${category.slug}`}>
            {category.name}
          </NavLink>
        );
      })}
    </>
  );
};

export default CategoryNavLinks;
