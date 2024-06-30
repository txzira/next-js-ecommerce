"use client";
import {
  Attribute,
  AttributeGroup,
  Category,
  Product,
  ProductImage,
} from "@prisma/client";
import { FormTitle } from "app/(components)/Form";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BsArrowLeftShort } from "react-icons/bs";
import useSWR from "swr";
import {
  CategoriesContainer,
  DetailsContainer,
  PriceContainer,
  VariantsContainer,
} from "./(components)/Product";
import { VariantsModal } from "./(components)/Variant";

const EditProductPage = () => {
  //   const { id } = useParams();

  //   const {
  //     data: productData,
  //     error: productError,
  //     isLoading: productIsLoading,
  //     mutate: productMutate,
  //   } = useSWR<
  //     Product & {
  //       categories: Category[];
  //       image: ProductImage;
  //     }
  //   >(`/admin/products/api/get-product/${id}`, (url) =>
  //     fetch(url).then((res) => res.json())
  //   );
  //   console.log(productData);

  //   const {
  //     data: categoriesData,
  //     error: categoriesError,
  //     isLoading: categoriesIsLoading,
  //     mutate: categoriesMutate,
  //   } = useSWR<Category[]>("/admin/categories/api/get-categories", (url) =>
  //     fetch(url).then((res) => res.json())
  //   );
  //   const [product, setProduct] = useState<
  //     Product & {
  //       categories: Category[];
  //       image: ProductImage;
  //     }
  //   >({
  //     id: null,
  //     name: "",
  //     price: 0,
  //     sku: null,
  //     quantity: null,
  //     description: null,
  //     slug: null,
  //     image: null,
  //     active: true,
  //     categories: [],
  //   });

  //   const {
  //     data: attributeGroupsData,
  //     error: attributeGroupsError,
  //     isLoading: attributeGroupsIsLoading,
  //     mutate: attributeGroupsMutate,
  //   } = useSWR<
  //     (AttributeGroup & {
  //       attributes: Attribute[];
  //     })[]
  //   >(`/admin/products/api/get-attribute-groups/${id}`, (url) =>
  //     fetch(url).then((res) => res.json())
  //   );
  //   const [defaultImage, setDefaultImage] = useState({
  //     imageName: "",
  //     imagePath: "",
  //     oldImagePubId: "",
  //   });

  //   const [showCategories, setShowCategories] = useState(false);
  //   const [showVariantsModal, setShowVariantsModal] = useState(false);
  //   const [selectedCategories, setSelectedCategories] = useState(
  //     new Map<number, Category>()
  //   );

  //   const editProduct = async (event) => {
  //     event.preventDefault();
  //     toast.loading("Loading...");
  //     console.log(selectedCategories);
  //     const response = await fetch("/admin/products/api/edit-product", {
  //       method: "POST",
  //       body: JSON.stringify({
  //         product,
  //         defaultImage,
  //         selectedCategories: Object.fromEntries(selectedCategories),
  //       }),
  //     });

  //     const message = await response.json();
  //     toast.dismiss();
  //     productMutate();
  //     if (response.status === 200) {
  //       toast.success(message);
  //     } else {
  //       toast.error(message);
  //     }
  //   };
  //   useEffect(() => {
  //     if (!productIsLoading) {
  //       setProduct({
  //         id: productData.id,
  //         name: productData.name,
  //         price: productData.price,
  //         sku: productData.sku,
  //         quantity: productData.quantity,
  //         description: productData.description,
  //         image: productData.image,
  //         slug: productData.slug,
  //         active: productData.active,
  //         categories: productData.categories,
  //       });
  //       if (productData.categories.length) {
  //         setSelectedCategories(
  //           new Map(
  //             productData.categories.map((category) => [category.id, category])
  //           )
  //         );
  //       }
  //     }
  //   }, [productIsLoading]);

  //   return (
  //     <div className="mx-auto h-full w-[90%]">
  //       {showVariantsModal ? (
  //         <VariantsModal setShowVariantsModal={setShowVariantsModal} />
  //       ) : null}

  //       <FormTitle className="flex flex-row items-center gap-3">
  //         <Link href="/admin/products">
  //           <BsArrowLeftShort size={30} />
  //         </Link>
  //         Edit Product
  //       </FormTitle>

  //       <pre>{JSON.stringify(product)}</pre>

  //       <form onSubmit={editProduct}>
  //         <DetailsContainer
  //           product={product}
  //           setProduct={setProduct}
  //           defaultImage={defaultImage}
  //           setDefaultImage={setDefaultImage}
  //         />
  //         <PriceContainer product={product} setProduct={setProduct} />
  //         <CategoriesContainer
  //           categoriesData={categoriesData}
  //           selectedCategories={selectedCategories}
  //           setSelectedCategories={setSelectedCategories}
  //           setShowCategories={setShowCategories}
  //           showCategories={showCategories}
  //         />
  //         <VariantsContainer
  //           attributeGroupsData={attributeGroupsData}
  //           attributeGroupsIsLoading={attributeGroupsIsLoading}
  //           setShowVariantsModal={setShowVariantsModal}
  //         />
  //         <button
  //           type="submit"
  //           className="w-full rounded-lg bg-green-600 py-3 text-white"
  //         >
  //           Save
  //         </button>
  //       </form>
  //     </div>
  //   );
  return <div></div>;
};

export default EditProductPage;
