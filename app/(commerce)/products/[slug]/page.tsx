import prisma from "lib/prisma";
import React from "react";
import ProductDetails from "./ProductDetails";

const ProductDetailPage = async ({ params }: { params: { slug: string } }) => {
  console.log(params.slug);
  const product = await prisma.product.findFirst({
    where: { slug: params.slug },
    include: {
      brand: true,
      images: true,
      productVariants: {
        include: {
          productVariantAttributes: { include: { attribute: true } },
          variantImages: true,
        },
      },
      attributeGroups: {
        include: { attributes: { include: { images: true } } },
      },
    },
  });
  console.log(product);

  return (
    <div>
      <ProductDetails product={product} />
    </div>
  );
};

export default ProductDetailPage;
