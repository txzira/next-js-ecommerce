import prisma from "lib/prisma";
import React from "react";
import ProductDetails from "./ProductDetails";
import { useSearchParams } from "next/navigation";

const ProductDetailPage = async ({ params }: { params: { slug: string } }) => {
  const product = await prisma!.product.findFirst({
    where: { slug: params.slug },
    include: {
      brand: true,
      images: true,
      productVariants: {
        include: {
          productVariantAttributes: {
            include: { attribute: true, attributeGroup: true },
          },
          variantImages: true,
        },
      },
      attributeGroups: {
        include: { attributes: { include: { images: true } } },
      },
    },
  });

  return (
    <div>
      <ProductDetails product={product} />
    </div>
  );
};

export default ProductDetailPage;
