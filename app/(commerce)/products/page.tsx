import prisma from "lib/prisma";
import React from "react";
import ProductsListings from "./ProductsListings";

const ProductsPage = async () => {
  const products = await prisma.product.findMany({
    where: { active: true },
    include: {
      brand: true,
      images: { orderBy: { position: "asc" } },
      attributeGroups: {
        include: {
          attributes: {
            include: {
              images: true,
            },
          },
        },
      },
      productVariants: {
        include: {
          productVariantAttributes: {
            include: {
              attribute: true,
            },
          },
          variantImages: true,
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  console.log("page loaded");
  return (
    <section>
      <h1 className="text-lg font-semibold">All Products</h1>
      <ProductsListings products={products} />
    </section>
  );
};

export default ProductsPage;
