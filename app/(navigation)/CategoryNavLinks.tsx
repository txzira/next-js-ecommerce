import NavLink from "app/(navigation)/NavLink";
import prisma from "lib/prisma";
import React from "react";

const CategoryNavLinks = async () => {
  const categories = await prisma!.category.findMany({
    where: { parentId: null, product: { some: { active: true } } },
  });

  return (
    <>
      {categories.map((category) => {
        return (
          <li key={category.id} className="">
            <NavLink href={`/categories/${category.slug}`}>
              {category.name}
            </NavLink>
          </li>
        );
      })}
    </>
  );
};

export default CategoryNavLinks;
