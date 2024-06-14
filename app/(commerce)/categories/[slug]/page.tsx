import ProductsListings from "app/(commerce)/products/ProductsListings";
import prisma from "lib/prisma";
import React from "react";

const Page = async ({ params }: { params: { slug: string } }) => {
  const products = await prisma.product.findMany({
    where: { categories: { some: { slug: params.slug } }, active: true },
    include: {
      brand: true,
      images: { orderBy: { position: "asc" } },
      attributeGroups: {
        include: { attributes: { include: { images: true } } },
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
  });

  const title = params.slug.split("-");
  for (let i = 0; i < title.length; i++) {
    title[i] = title[i][0].toUpperCase() + title[i].substring(1);
  }
  title.join(" ");

  return (
    <div>
      <section>
        <h1 className="text-xl">{title}</h1>
        <ProductsListings products={products} />
      </section>
    </div>
  );
};

export default Page;
