"use client";
import {
  Attribute,
  AttributeGroup,
  AttributeImage,
  Product,
  ProductImage,
  ProductVariant,
  ProductVariantAttribute,
  ProductVariantImage,
} from "@prisma/client";
import Loader from "app/(components)/Loader";
import { USDollar } from "lib/utils";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { AttributeProps, ProductProps } from "types/product";

const ProductCard = ({ product }: { product: ProductProps }) => {
  const [displayImage, setDisplayImage] = useState(product.images?.[0]?.url);

  const [colors, setColors] = useState<Array<AttributeProps>>([]);
  const [price, setPrice] = useState<number | undefined>(product.price);
  const [available, setAvailable] = useState(product.available);

  useEffect(() => {
    if (product.productVariants.length) {
      for (let i = 0; i < product.attributeGroups.length; i++) {
        if (
          product.attributeGroups[i].name.toLowerCase() === "colors" ||
          product.attributeGroups[i].name.toLowerCase() === "styles"
        ) {
          setColors(product.attributeGroups?.[i]?.attributes || []);
        }
      }
      for (let i = 0; i < product.productVariants.length; i++) {
        const productVariant = product.productVariants[i];
        if (productVariant.available) {
          productVariant.variantImages?.[0]?.url
            ? setDisplayImage(productVariant.variantImages[0]?.url)
            : setDisplayImage(product.images?.[0]?.url);
          setPrice(productVariant?.price);
          setAvailable(true);
          break;
        }
      }
    }
  }, [product]);

  return (
    <div className="relative mx-auto flex min-h-[365px] w-[300px] bg-white  ">
      <div className="group absolute h-full w-full cursor-pointer bg-inherit shadow-lg hover:z-10 hover:h-max hover:min-h-[365px] hover:border hover:border-black ">
        <div
          id="image-wrapper"
          className="relative h-[300px] w-full bg-gray-50 bg-[radial-gradient(rgb(249,250,251),rgb(209,213,219))] ">
          <Link
            href={`/products/${product.slug}`}
            className="absolute h-full w-full">
            {displayImage || product ? (
              <Image
                fill
                src={displayImage ? displayImage : ""}
                alt="card image"
                className="object-contain"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <Loader />
              </div>
            )}
          </Link>
          <p className="absolute bottom-0 left-1 bg-white p-1 text-xs group-hover:bottom-1">
            {available ? USDollar.format(price!) : "Sold Out"}
          </p>
        </div>

        {colors && colors.length > 0 && (
          <div className="hidden h-10 flex-row py-1 group-hover:flex ">
            {colors.map((color) => {
              return (
                <Link
                  href={{
                    pathname: `/products/${product.slug}`,
                    query: {
                      attrGroupId: color.attributeGroupId,
                      colorId: color.id,
                    },
                  }}
                  key={color.id}
                  className="relative h-10 w-10 border-black bg-gradient-to-b from-gray-300 to-gray-100 hover:border-b"
                  onMouseEnter={() => checkAvailability(color)}>
                  <Image
                    fill
                    className=" object-contain "
                    alt="carousel image"
                    src={
                      color.images &&
                      color.images.length &&
                      color.images[0]?.url
                        ? color.images[0]?.url
                        : ""
                    }
                  />
                </Link>
              );
            })}
          </div>
        )}

        <Link href={`/products/${product.slug}`}>
          <div className="h-full w-full flex-1 p-2">
            <p className="text-left">{product.name}</p>
            {colors && colors.length > 0 && (
              <p className="text-sm text-gray-400">{colors.length} colors</p>
            )}
          </div>
        </Link>
      </div>
    </div>
  );

  function checkAvailability(color: AttributeProps) {
    setDisplayImage(
      color.images && color.images.length > 0 ? color.images[0]?.url : ""
    );
    const available = product.productVariants.find((productVariant) => {
      const productVariantAttributes = productVariant.productVariantAttributes;
      let found = false;
      for (let i = 0; i < productVariantAttributes.length; i++) {
        if (
          productVariantAttributes[i].attribute.id === color.id &&
          productVariant.available
        ) {
          if (product.managedStock) {
            if (productVariant.quantity! > 0) {
              found = true;
              break;
            } else {
              found = false;
              break;
            }
          } else {
            found = true;
            break;
          }
        }
      }
      return found;
    });
    if (available) {
      setAvailable(true);
      setPrice(available.price);
    } else {
      setAvailable(false);
      // setPrice(available.price);
    }
    return;
  }
};

export default ProductCard;
