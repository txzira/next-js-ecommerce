"use client";
import {
  Attribute,
  AttributeGroup,
  AttributeImage,
  Category,
  Product,
  ProductImage,
  ProductVariant,
  ProductVariantAttribute,
  ProductVariantImage,
} from "@prisma/client";
import Loader from "app/(components)/Loader";
import React from "react";
import ProductCard from "./ProductCard";
import { ProductProps } from "types/product";

const ProductsListings = ({ products }: { products: Array<ProductProps> }) => {
  return (
    <div className="grid grid-cols-1 grid-rows-1 items-center justify-center gap-y-10 py-10 md:grid-cols-4 ">
      {products ? (
        products.map((product) => {
          return <ProductCard key={product.id} product={product} />;
        })
      ) : (
        <div className="flex justify-center py-5">
          <Loader />
        </div>
      )}
    </div>
  );
};

export default ProductsListings;
