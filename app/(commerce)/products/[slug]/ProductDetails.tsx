"use client";

import { IoRemove, IoAdd } from "react-icons/io5";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  AttributeGroupProps,
  AttributeProps,
  ProductProps,
  ProductVariantProps,
} from "types/product";
import { HiOutlineArrowNarrowLeft } from "react-icons/hi";
import { FaArrowCircleLeft, FaArrowCircleRight } from "react-icons/fa";

import { USDollar } from "lib/utils";
import Image from "next/image";

const ProductDetails = ({ product }: { product: ProductProps }) => {
  const [selectedOptionsMap, setSelectedOptionsMap] = useState<
    Map<number, number>
  >(new Map());

  const [selectedProductVariant, setSelectedProductVariant] =
    useState<ProductVariantProps>(undefined);

  const [attributeGroups, setAttributeGroups] = useState<
    Array<AttributeGroupProps>
  >(product.attributeGroups);

  const [quantity, setQuantity] = useState(1);

  const [displayImage, setDisplayImage] = useState({
    url: "",
    index: 0,
    imageCount: 0,
  });

  const [displayImages, setDisplayImages] = useState([]);
  const [unavailableVariants, setUnavailableVariants] = useState<
    Array<ProductVariantProps>
  >([]);

  useEffect(() => {
    console.log(product);
    setDisplayImage({
      url: product.images?.[0]?.url,
      index: 0,
      imageCount: product.images?.length,
    });

    if (product.images) setDisplayImages(product.images);
    setColorAsFirstAttributeGroup();
    setDefaultSelectedOptions(product);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product]);

  return (
    <div className=" py-4">
      <Link href="/products">
        <button className="flex flex-row items-center gap-2">
          <HiOutlineArrowNarrowLeft size={30} />
          <span>BACK TO STORE</span>
        </button>
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
            <Image
              className="self-center object-contain"
              fill
              alt={`Image of ${product.name}`}
              src={displayImage.url}
            />
            {displayImages?.length > 0 && (
              <div className="absolute top-1/2 z-50 flex w-full flex-row justify-between group-hover:visible md:invisible">
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
          <div className="flex flex-row gap-4 py-3">
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
                        className="rounded-md object-cover"
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
                        {attributeGroup.attributes.map((attribute) => {
                          return (
                            <div
                              key={attribute.id}
                              className="relative min-h-12 min-w-12 ">
                              <input
                                id={attribute.name}
                                type="radio"
                                className="peer hidden"
                                onClick={() =>
                                  onSelectOption(
                                    attributeGroup.id,
                                    attribute.id,
                                    index
                                  )
                                }
                                disabled={disableOption(
                                  index,
                                  attributeGroups[0],
                                  attribute
                                )}
                                checked={
                                  selectedOptionsMap.get(attributeGroup.id) ===
                                  attribute.id
                                }
                                name={attributeGroup.name}
                              />

                              <label
                                htmlFor={attribute.name}
                                className="peer-checked flex h-full w-full items-center justify-center  bg-slate-300 px-2 py-1 peer-checked:bg-white peer-enabled:cursor-pointer peer-enabled:hover:bg-white peer-disabled:opacity-30">
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
                  <span className="flex h-full items-center text-nowrap border-y border-slate-300 px-2">
                    Quantity: {quantity}
                  </span>
                  <button
                    className="flex h-full w-full items-center rounded-r-full border border-slate-300 bg-slate-300 px-2 hover:bg-[#3f51b5] hover:text-white"
                    onClick={() => onIncrementQuantity()}>
                    <IoAdd />
                  </button>
                </div>
                <button
                  mat-raised-button
                  color="primary"
                  className="!h-10 w-[420px] max-w-[50%] !rounded-full bg-[#3f51b5] text-lg text-white shadow-lg hover:brightness-125 active:shadow-inner"
                  disabled={checkIfSoldOut()}
                  // (click)="onAddToCart()"
                >
                  {checkIfSoldOut() ? "Sold Out" : "Add to Cart"}
                </button>
              </div>
            </div>
            <div className="w-full border-t border-slate-400" />
            <div>
              <p className="text-xl">Description:</p>
              <p className="whitespace-pre-line text-lg font-medium leading-loose text-red-600">
                {product.description ? product.description : "No Description."}
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="">
        <div className="h-10 w-10  rotate-45 border-t border-black" />
      </div> */}
    </div>
  );

  function scrollImageLeft() {
    if (displayImage.index > 0) {
      displayImage.index -= 1;
    } else {
      displayImage.index = displayImage.imageCount - 1;
    }
    displayImage.url = displayImages?.[displayImage.index].url;
    setDisplayImage({ ...displayImage });
  }
  function scrollImageRight() {
    if (displayImage.index < displayImage.imageCount - 1) {
      displayImage.index += 1;
    } else {
      displayImage.index = 0;
    }
    displayImage.url = displayImages?.[displayImage.index].url;
    setDisplayImage({ ...displayImage });
  }

  function onChangeDisplayImage(imageUrl, index) {
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
        console.log("here");
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
    if (product.productVariants.length && selectedProductVariant) {
      if (checkProductVariantAvailability(selectedProductVariant)) return false;
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

  function findFirstAvailProdVariant(
    attributeGroupId: number,
    attributeId: number
  ): void {
    console.log({ attributeGroupId, attributeId });
    console.log(selectedOptionsMap);

    setSelectedOption(attributeGroupId, attributeId);
    console.log(selectedOptionsMap);
    setUnavailableVariants([]);

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
              console.log("here");

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
      console.log("hre");
      for (
        let i = 0;
        i < firstAvailableProdVariant.productVariantAttributes.length;
        i++
      ) {
        console.log("here");
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
          console.log("hre");

          setSelectedOption(variantAttribute.attibuteGroupId, 0);
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
    const tempAttributeGroups = product.attributeGroups;
    for (let i = 0; i < tempAttributeGroups.length; i++) {
      if (
        ["style", "styles", "color", "colors"].includes(
          tempAttributeGroups[i].name.toLowerCase()
        )
      ) {
        setAttributeGroups([
          tempAttributeGroups.splice(i, 1)[0],
          ...tempAttributeGroups,
        ]);
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
          if (productVariants[i].variantImages.length) {
            setDisplayImages(productVariants[i].variantImages);
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
      if (product.managedStock) {
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
    const tempSelectedProductVariant = product.productVariants.find(
      (productVariant) => {
        return containsSelectedVariantAttributes(
          productVariant,
          selectedOptionsMap
        );
      }
    );

    if (tempSelectedProductVariant) {
      if (tempSelectedProductVariant.variantImages.length) {
        setDisplayImage({
          url: tempSelectedProductVariant.variantImages[0].url,
          index: 0,
          imageCount: tempSelectedProductVariant.variantImages.length,
        });
        setDisplayImages(tempSelectedProductVariant.variantImages);
      } else {
        if (product.images && product.images.length) {
          setDisplayImage({
            url: product.images?.[0]?.url,
            index: 0,
            imageCount: product.images?.length,
          });
          setDisplayImages(product.images);
        } else {
          setDisplayImage({
            url: undefined,
            index: 0,
            imageCount: undefined,
          });
          setDisplayImages(undefined);
        }
      }

      return tempSelectedProductVariant;
    } else {
      if (attributeGroups && attributeGroups.length > 1) {
        if (unavailableVariants.length) {
          setDisplayImage({
            url: unavailableVariants[0].variantImages?.[0]?.url,
            index: 0,
            imageCount: unavailableVariants[0].variantImages?.length,
          });
          setDisplayImages(unavailableVariants[0].variantImages);
        } else {
          setDisplayImage({
            url: undefined,
            index: 0,
            imageCount: undefined,
          });
          setDisplayImages(undefined);
        }
      } else {
        if (product.images && product.images.length) {
          setDisplayImage({
            url: product.images?.[0]?.url,
            index: 0,
            imageCount: product.images?.length,
          });
          setDisplayImages(product.images);
        } else {
          setDisplayImage({
            url: undefined,
            index: 0,
            imageCount: undefined,
          });
          setDisplayImages(undefined);
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
