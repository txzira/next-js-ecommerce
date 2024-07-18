"use client";

import { IoRemove, IoAdd } from "react-icons/io5";
import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";
import {
  AttributeGroupProps,
  AttributeProps,
  CartItemProps,
  ImageProps,
  ProductProps,
  ProductVariantProps,
} from "types/product";
import { HiOutlineArrowNarrowLeft } from "react-icons/hi";
import { FaArrowCircleLeft, FaArrowCircleRight } from "react-icons/fa";

import { USDollar } from "lib/utils";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useCartState } from "app/CartProvider";
import toast from "react-hot-toast";
import { ProductVariantImage } from "@prisma/client";

const ProductDetails = ({ product }: { product: ProductProps | null }) => {
  const searchParams = useSearchParams();
  const attributeGroupIdQueryParam = searchParams?.get("attrGroupId");
  const colorIdQueryParam = searchParams?.get("colorId");
  const { cartItems, addToCart } = useCartState();

  const [selectedOptionsMap, setSelectedOptionsMap] = useState<
    Map<number, number>
  >(new Map());

  const [selectedProductVariant, setSelectedProductVariant] = useState<
    ProductVariantProps | undefined
  >(undefined);

  const [attributeGroups, setAttributeGroups] = useState<
    Array<AttributeGroupProps>
  >(product && product.attributeGroups ? product.attributeGroups : []);

  const [quantity, setQuantity] = useState(1);

  const [displayImage, setDisplayImage] = useState<{
    url: string;
    index: number;
    imageCount: number;
  }>({
    url: "",
    index: 0,
    imageCount: 0,
  });

  const [displayImages, setDisplayImages] = useState<
    (ImageProps & { productId?: number })[]
  >([]);
  const [unavailableVariants, setUnavailableVariants] = useState<
    ProductVariantProps[]
  >([]);

  useEffect(() => {
    if (product) {
      if (product.images) {
        setDisplayImage({
          url: product.images[0].url || "",
          index: 0,
          imageCount: product.images.length || 0,
        });

        setDisplayImages(product.images);
      }
      setColorAsFirstAttributeGroup();
      if (attributeGroupIdQueryParam && colorIdQueryParam) {
        findFirstAvailProdVariant(
          Number(attributeGroupIdQueryParam),
          Number(colorIdQueryParam)
        );
      } else {
        setDefaultSelectedOptions(product);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (product) {
    return (
      <div className=" py-4">
        <Link
          href="/products"
          className="flex w-max flex-row items-center gap-2">
          <HiOutlineArrowNarrowLeft size={30} />
          <span>BACK TO STORE</span>
        </Link>
        <div className="flex flex-col md:flex-row md:justify-between">
          <div className="md:hidden" id="product-header">
            {product.brand && <h4 className="text-sm">{product.brand.name}</h4>}
            <h2 className="text-3xl font-medium">{product.name}</h2>
            <p className="text-base font-medium">
              {USDollar.format(
                !selectedProductVariant
                  ? Number(product.price)
                  : Number(selectedProductVariant.price)
              )}
            </p>
          </div>
          <div className="flex h-auto w-full flex-col md:w-[49%] md:items-center md:justify-center ">
            <div className="group relative flex h-[400px] w-full justify-center md:h-[700px]">
              {displayImage.url && (
                <Image
                  className="self-center object-contain"
                  fill
                  alt={`Image of ${product.name}`}
                  src={displayImage.url}
                />
              )}
              {displayImages?.length > 0 && (
                <div className="absolute top-1/2 z-40 flex w-full flex-row justify-between group-hover:visible md:invisible">
                  <button
                    className="flex items-center rounded-full bg-slate-300 p-1"
                    onClick={() => scrollImageLeft()}>
                    <FaArrowCircleLeft />
                  </button>
                  <button
                    className="flex items-center rounded-full bg-slate-300 p-1"
                    onClick={() => scrollImageRight()}>
                    <FaArrowCircleRight />
                  </button>
                </div>
              )}
            </div>
            <div className="flex flex-row gap-4 px-2 py-3 sm:px-0">
              {displayImages && (
                <>
                  {displayImages.map((image, index) => {
                    return (
                      <button
                        key={image.id}
                        className={`relative h-20 w-20 rounded-md ${
                          displayImage.index === index && "border border-black"
                        } `}
                        onClick={() => onChangeDisplayImage(image.url, index)}>
                        <Image
                          className="rounded-md bg-[radial-gradient(rgb(249,250,251),rgb(209,213,219))] object-cover"
                          fill
                          alt={`Display Image ${index + 1}`}
                          src={image.url}
                        />
                      </button>
                    );
                  })}
                </>
              )}
            </div>
          </div>
          <div className="md:w-[49%]">
            <div className="mx-auto flex flex-col gap-3 md:w-2/3">
              <div className="hidden md:block">
                {product.brand && (
                  <h4 className="text-sm">{product.brand.name}</h4>
                )}
                <h2 className="!text-3xl !font-medium">{product.name}</h2>
                <p className="text-base font-medium">
                  {USDollar.format(
                    !selectedProductVariant
                      ? Number(product.price)
                      : Number(selectedProductVariant.price)
                  )}
                </p>
              </div>
              <div className="w-full border-t border-slate-400" />
              <div className="flex flex-col gap-5">
                {attributeGroups &&
                  attributeGroups.map((attributeGroup, index) => {
                    return (
                      <div key={attributeGroup.id}>
                        <p>{attributeGroup.name}</p>
                        <div className="flex w-max flex-row divide-x  border bg-white   ">
                          {attributeGroup.attributes &&
                            attributeGroup.attributes.map((attribute) => {
                              return (
                                <div
                                  key={attribute.id}
                                  className="relative min-h-12 min-w-12 ">
                                  <input
                                    id={attribute.name}
                                    type="radio"
                                    className="peer hidden"
                                    onChange={() =>
                                      onSelectOption(
                                        attributeGroup.id!,
                                        attribute.id!,
                                        index
                                      )
                                    }
                                    disabled={disableOption(
                                      index,
                                      attributeGroups[0],
                                      attribute
                                    )}
                                    checked={
                                      selectedOptionsMap.get(
                                        attributeGroup.id!
                                      ) === attribute.id
                                    }
                                    name={attributeGroup.name}
                                  />

                                  <label
                                    htmlFor={attribute.name}
                                    className="peer-checked flex h-full w-full items-center justify-center  bg-slate-300 px-2 py-1 peer-checked:border peer-checked:border-black peer-checked:bg-white peer-enabled:cursor-pointer peer-enabled:hover:bg-white peer-disabled:opacity-30">
                                    {attribute.name}
                                  </label>
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    );
                  })}
                <div className="mx-auto flex w-full flex-row items-center justify-evenly">
                  <div className="flex h-10 w-min flex-row items-center">
                    <button
                      className="flex h-full w-full items-center rounded-l-full border border-slate-300 bg-slate-300 px-2 hover:bg-[#3f51b5] hover:text-white"
                      onClick={() => onDecrementQuantity()}>
                      <IoRemove />
                    </button>
                    <span className="flex h-full items-center text-nowrap border-y border-slate-300 bg-white px-2">
                      Quantity: {quantity}
                    </span>
                    <button
                      className="flex h-full w-full items-center rounded-r-full border border-slate-300 bg-slate-300 px-2 hover:bg-[#3f51b5] hover:text-white"
                      onClick={() => onIncrementQuantity()}>
                      <IoAdd />
                    </button>
                  </div>
                  <button
                    color="primary"
                    className="!h-10 w-[420px] max-w-[50%] rounded-full bg-[#3f51b5] text-lg text-white shadow-lg hover:brightness-125 active:shadow-inner"
                    disabled={checkIfSoldOut()}
                    onClick={() => onAddToCart()}>
                    {checkIfSoldOut() ? "Sold Out" : "Add to Cart"}
                  </button>
                </div>
              </div>
              <div className="w-full border-t border-slate-400" />
              <div>
                <p className="text-xl">Description:</p>
                <p className="whitespace-pre-line text-lg font-medium leading-loose text-red-600">
                  {product.description
                    ? product.description
                    : "No Description."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return <div></div>;
  }

  function onAddToCart() {
    let cartItem: CartItemProps;
    if (product) {
      selectedProductVariant
        ? (cartItem = {
            id: `prod${product.id}var${selectedProductVariant.id}`,
            productId: product.id,
            productName: product.name,
            price: selectedProductVariant.price!,
            quantity: quantity,
            ...(selectedProductVariant.variantImages &&
            selectedProductVariant.variantImages.length
              ? { image: selectedProductVariant.variantImages[0].url }
              : product.images && product.images.length
              ? { image: product.images?.[0].url }
              : { image: "" }),
            variant: {
              id: selectedProductVariant.id,
              productVariantAttributes:
                selectedProductVariant.productVariantAttributes,
            },
          })
        : (cartItem = {
            id: `prod${product.id}`,
            productId: product.id,
            productName: product.name,
            price: product.price,
            quantity: quantity,
            ...(product.images && product.images.length
              ? { image: product.images?.[0].url }
              : { image: "" }),
            variant: undefined,
          });
      addToCart(cartItem);
      toast.success(
        `${cartItem.productName}${
          cartItem.variantName ? " - " + cartItem.variantName : ""
        } added to cart.`
      );
    } else {
      toast.error("Failed to add to cart");
    }
  }

  function scrollImageLeft() {
    if (displayImage.index > 0) {
      displayImage.index -= 1;
    } else {
      displayImage.index = displayImage.imageCount - 1;
    }
    displayImage.url = displayImages[displayImage.index].url;
    setDisplayImage({ ...displayImage });
  }
  function scrollImageRight() {
    if (displayImage.index < displayImage.imageCount - 1) {
      displayImage.index += 1;
    } else {
      displayImage.index = 0;
    }
    displayImage.url = displayImages[displayImage.index].url;
    setDisplayImage({ ...displayImage });
  }

  function onChangeDisplayImage(imageUrl: string, index: number) {
    displayImage.url = imageUrl;
    displayImage.index = index;
    setDisplayImage({ ...displayImage });
  }

  function onSelectOption(
    attributeGroupId: number,
    attributeId: number,
    attributeGroupIndex: number
  ): void {
    if (product) {
      if (attributeGroupIndex) {
        //size or other attribute type was clicked
        setSelectedOption(attributeGroupId, attributeId);
      } else {
        //color or style attribute was clicked
        //Ex. use clicked color:blue color-attributeGroupId:1 blue-attributeId:14
        //Find first availabale variant with combination (1,14)
        findFirstAvailProdVariant(attributeGroupId, attributeId);
      }
    }
  }

  function disableOption(
    index: number,
    firstAttributeGroup: AttributeGroupProps,
    attribute: AttributeProps
  ): boolean {
    const optionMap = new Map();
    if (attributeGroups.length > 1) {
      optionMap.set(attribute.attributeGroupId, attribute.id);

      optionMap.set(
        firstAttributeGroup.id,
        selectedOptionsMap.get(firstAttributeGroup.id!)
      );
    } else {
      optionMap.set(attribute.attributeGroupId, attribute.id);
    }

    if (!index && attributeGroups.length > 1) {
      return false;
    } else {
      if (product) {
        const result = product.productVariants.find((productVariant) => {
          return containsSelectedVariantAttributes(productVariant, optionMap);
        });
        if (result) {
          return !checkProductVariantAvailability(result);
        } else return true;
      } else {
        return false;
      }
    }
  }

  function checkIfSoldOut(): boolean {
    //If product has variants
    if (product) {
      if (product.productVariants.length && selectedProductVariant) {
        if (checkProductVariantAvailability(selectedProductVariant))
          return false;
        else return true;

        //else standalone product
      } else {
        if (product.available) {
          if (product.managedStock) {
            if (product.quantity) {
              return false;
            } else {
              return true;
            }
          } else {
            return false;
          }
        } else {
          return true;
        }
      }
    }
    return false;
  }

  function findFirstAvailProdVariant(
    attributeGroupId: number,
    attributeId: number
  ): void {
    setSelectedOption(attributeGroupId, attributeId);
    setUnavailableVariants([]);
    if (product) {
      const firstAvailableProdVariant = product.productVariants.find(
        (productVariant) => {
          if (checkProductVariantAvailability(productVariant)) {
            for (
              let i = 0;
              i < productVariant.productVariantAttributes.length;
              i++
            ) {
              const productVariantAttribute =
                productVariant.productVariantAttributes[i];

              if (
                productVariantAttribute.attibuteGroupId === attributeGroupId &&
                productVariantAttribute.attributeId === attributeId
              ) {
                return true;
              }
            }
          } else {
            for (
              let i = 0;
              i < productVariant.productVariantAttributes.length;
              i++
            ) {
              const productVariantAttribute =
                productVariant.productVariantAttributes[i];

              if (
                productVariantAttribute.attibuteGroupId === attributeGroupId &&
                productVariantAttribute.attributeId === attributeId
              ) {
                unavailableVariants.push(productVariant);
                setUnavailableVariants(unavailableVariants);
              }
            }
          }

          return false;
        }
      );
      if (firstAvailableProdVariant) {
        for (
          let i = 0;
          i < firstAvailableProdVariant.productVariantAttributes.length;
          i++
        ) {
          const variantAttribute =
            firstAvailableProdVariant.productVariantAttributes[i];
          if (attributeGroupId !== variantAttribute.attibuteGroupId)
            setSelectedOption(
              variantAttribute.attibuteGroupId,
              variantAttribute.attributeId
            );
        }
      } else {
        for (
          let i = 0;
          i < product.productVariants[0].productVariantAttributes.length;
          i++
        ) {
          const variantAttribute =
            product.productVariants[0].productVariantAttributes[i];
          if (attributeGroupId !== variantAttribute.attibuteGroupId) {
            setSelectedOption(variantAttribute.attibuteGroupId, 0);
          }
        }
      }
    }
  }

  function onIncrementQuantity() {
    setQuantity(quantity + 1);
  }

  function onDecrementQuantity() {
    if (quantity > 1) setQuantity(quantity - 1);
  }

  function setColorAsFirstAttributeGroup() {
    let tempAttributeGroups =
      product?.attributeGroups.map((attributeGroup) => {
        return { ...attributeGroup };
      }) || [];
    for (let i = 0; i < tempAttributeGroups.length; i++) {
      if (
        ["style", "styles", "color", "colors"].includes(
          tempAttributeGroups[i].name.toLowerCase()
        )
      ) {
        tempAttributeGroups = [
          tempAttributeGroups.splice(i, 1)[0],
          ...tempAttributeGroups,
        ];
        setAttributeGroups(tempAttributeGroups);
        return;
      }
    }
  }

  function setDefaultSelectedOptions(product: ProductProps) {
    if (product.productVariants.length) {
      const productVariants = product.productVariants;
      for (let i = 0; i < productVariants.length; i++) {
        if (checkProductVariantAvailability(productVariants[i])) {
          productVariants[i].productVariantAttributes.map(
            (productVariantAttribute) => {
              setSelectedOption(
                productVariantAttribute.attibuteGroupId,
                productVariantAttribute.attributeId
              );
            }
          );
          if (productVariants[i].variantImages?.length) {
            setDisplayImages(productVariants[i].variantImages || []);
          }
          return;
        }
      }
    }
  }

  function containsSelectedVariantAttributes(
    productVariant: ProductVariantProps,
    selectedOptions: Map<number, number>
  ): boolean {
    let result = false;

    for (let i = 0; i < productVariant.productVariantAttributes.length; i++) {
      const productVariantAttribute =
        productVariant.productVariantAttributes[i];

      if (
        selectedOptions.get(productVariantAttribute.attibuteGroupId) ===
          productVariantAttribute.attributeId &&
        checkProductVariantAvailability(productVariant)
      ) {
        result = true;
      } else {
        return false;
      }
    }
    return result;
  }

  function checkProductVariantAvailability(
    productVariant: ProductVariantProps
  ) {
    if (productVariant.available) {
      if (product && product.managedStock) {
        if (productVariant.quantity > 0) {
          return true;
        } else {
          return false;
        }
      } else {
        return true;
      }
    } else {
      return false;
    }
  }

  function setSelectedOption(
    attributeGroupId: number,
    attributeId: number
  ): void {
    setSelectedOptionsMap(
      new Map(selectedOptionsMap.set(attributeGroupId, attributeId))
    );
    setSelectedProductVariant(findSelectedProductVariant());
  }

  function findSelectedProductVariant(): ProductVariantProps | undefined {
    const tempSelectedProductVariant =
      product?.productVariants.find((productVariant) => {
        return containsSelectedVariantAttributes(
          productVariant,
          selectedOptionsMap
        );
      }) || undefined;

    if (tempSelectedProductVariant) {
      if (
        tempSelectedProductVariant.variantImages &&
        tempSelectedProductVariant.variantImages.length
      ) {
        setDisplayImage({
          url: tempSelectedProductVariant.variantImages[0].url || "",
          index: 0,
          imageCount: tempSelectedProductVariant.variantImages.length || 0,
        });
        setDisplayImages(tempSelectedProductVariant.variantImages || []);
      } else {
        if (product && product.images && product.images.length) {
          setDisplayImage({
            url: product.images[0].url,
            index: 0,
            imageCount: product.images.length,
          });
          setDisplayImages(product.images);
        } else {
          setDisplayImage({
            url: "",
            index: 0,
            imageCount: 0,
          });
          setDisplayImages([]);
        }
      }

      return tempSelectedProductVariant;
    } else {
      if (attributeGroups && attributeGroups.length > 1) {
        if (unavailableVariants.length) {
          setDisplayImage({
            url: unavailableVariants[0].variantImages?.[0].url || "",
            index: 0,
            imageCount: unavailableVariants[0].variantImages?.length || 0,
          });
          setDisplayImages(
            (unavailableVariants[0].variantImages as ProductVariantImage[]) ||
              []
          );
        } else {
          setDisplayImage({
            url: "",
            index: 0,
            imageCount: 0,
          });
          setDisplayImages([]);
        }
      } else {
        if (product && product.images && product.images.length) {
          setDisplayImage({
            url: product.images?.[0]?.url,
            index: 0,
            imageCount: product.images?.length,
          });
          setDisplayImages(product.images);
        } else {
          setDisplayImage({
            url: "undefined",
            index: 0,
            imageCount: 0,
          });
          setDisplayImages([]);
        }
      }
    }
    return;
  }
};

export default ProductDetails;

// <div class="w-11/12 mx-auto py-4">

//   <div class="flex flex-col md:flex-row md:justify-between" *ngIf="product">

//     <div class="md:w-[49%]">
//       <div class="flex flex-col mx-auto md:w-2/3 gap-3">
//

//         <div>
//           <p class="text-xl">Description:</p>
//           <p
//             class="whitespace-pre-line leading-loose text-lg text-red-600 font-medium"
//           >
//             {{ product.description ? product.description : "No Description." }}
//           </p>
//         </div>
//       </div>
//     </div>
//   </div>
// </div>
