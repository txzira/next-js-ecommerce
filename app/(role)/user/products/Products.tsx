"use client";
import React, { useEffect, useState } from "react";
import { CartItem, Category, Product as Prod, ProductVariant } from "@prisma/client";

import { useSession } from "next-auth/react";
import useSWR from "swr";
import Image from "next/image";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Loader from "app/Loader";
import { GrAdd, GrSubtract } from "react-icons/gr";
import { AiOutlineShoppingCart } from "react-icons/ai";

export function ProductPage({ categories }: { categories: Category[] }) {
  const [productDetails, setProductDetails] = useState<
    Prod & {
      category: Category;
      productVariants: ProductVariant[];
    }
  >(null);

  return (
    <div>
      <ProductTable categories={categories} setProductDetails={setProductDetails} />
      {productDetails ? <ProductDetails productDetails={productDetails} setProductDetails={setProductDetails} /> : null}
    </div>
  );
}

function Product({
  product,
  setProductDetails,
}: {
  product: Prod & {
    category: Category;
    productVariants: ProductVariant[];
  };
  setProductDetails: React.Dispatch<
    React.SetStateAction<
      Prod & {
        category: Category;
        productVariants: ProductVariant[];
      }
    >
  >;
}) {
  return (
    <div className="grid grid-cols-5 items-center text-sm even:bg-slate-200 h-10 ">
      <div className="pl-2 text-left col-span-2">{product.name}</div>
      <div className="text-center">{product.price}</div>
      <div className="text-center">{product.category ? product.category.name : null}</div>
      <button
        className="mx-auto bg-green-600 rounded-full w-min p-2 hover:bg-white hover:text-black"
        onClick={() => setProductDetails(product)}
      >
        <AiOutlineShoppingCart size={14} color="white" />
      </button>
    </div>
  );
}

function ProductTable({
  categories,
  setProductDetails,
}: {
  categories: Category[];
  setProductDetails: React.Dispatch<
    React.SetStateAction<
      Prod & {
        category: Category;
        productVariants: ProductVariant[];
      }
    >
  >;
}) {
  const fetcher = (url) => fetch(url).then((res) => res.json());
  const { data: productsData, error: productsError, isLoading: productsIsLoading } = useSWR("/user/products/get-products", fetcher);

  const [categoryFilter, setCategoryFilter] = useState("All");
  const [products, setProducts] = useState<
    (Prod & {
      category: Category;
      productVariants: ProductVariant[];
    })[]
  >();

  useEffect(() => {
    if (productsData) {
      setProducts(productsData.products);
    }
  }, [productsData]);

  useEffect(() => {
    if (categoryFilter === "All") {
      setProducts(productsData?.products);
    } else {
      setProducts(
        productsData.products.filter((product) => {
          return product.category?.name === categoryFilter;
        })
      );
    }
  }, [categoryFilter, productsData?.products]);

  return (
    <div>
      <h1 className="text-center my-2 text-2xl md:text-2xl  font-bold">Menu</h1>
      <div className="md:w-3/5  mx-auto gap-4 ">
        <select
          className="px-2 py-1 border-2 border-black rounded-lg focus:outline-none mb-2"
          onChange={(event) => setCategoryFilter(event.target.value)}
        >
          <option value="All">All Categories</option>
          {categories.map((category) => {
            return (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            );
          })}
        </select>
        <div className=" rounded-b-xl  border-black border-2 shadow-2xl bg-white ">
          <div className="grid grid-cols-5 h-12 items-center font-bold text-base md:text-base text-center bg-black text-white md:pr-4">
            <div className="md:px-2 col-span-2">Name</div>
            <div className="md:px-2">Price</div>
            <div className="md:px-2">Category</div>
            <div></div>
          </div>
          <div className="overflow-y-auto h-72 w-full ">
            {products ? (
              products.map(
                (
                  product: Prod & {
                    category: Category;
                    productVariants: ProductVariant[];
                  }
                ) => {
                  return <Product key={product.id} product={product} setProductDetails={setProductDetails} />;
                }
              )
            ) : (
              <div className="flex justify-center py-5">
                <Loader />
              </div>
            )}
          </div>
          <div className="grid grid-cols-3 h-2 "></div>
        </div>
      </div>
    </div>
  );
}

function ProductDetails({
  productDetails,
  setProductDetails,
}: {
  productDetails: Prod & {
    category: Category;
    productVariants: ProductVariant[];
  };
  setProductDetails: React.Dispatch<
    React.SetStateAction<
      Prod & {
        category: Category;
        productVariants: ProductVariant[];
      }
    >
  >;
}) {
  const variants = productDetails.productVariants;
  const [selectedVariant, setSelectedVariant] = useState({ variantId: 0, variantPrice: 0 });
  // const [product, setProduct] = useState<
  //   Prod & {
  //     category: Category;
  //     productVariants: ProductVariant[];
  //   }
  // >();
  const initalCartItem = { productId: 0, quantity: 1, variantId: 0 };
  const [cartItem, setCartItem] = useState(initalCartItem);

  useEffect(() => {
    if (variants.length > 0) {
      setSelectedVariant({ variantId: variants[0].id, variantPrice: variants[0].price });
      setCartItem({ ...cartItem, variantId: variants[0].id, productId: productDetails.id });
    } else {
      setCartItem({ ...cartItem, productId: productDetails.id });
    }
    // setProduct(productDetails);
  }, [productDetails, cartItem, variants]);

  const handleVariantSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    event.preventDefault();
    const index = event.target.selectedIndex;
    const element = event.target.children[index];
    const price = element.getAttribute("id");
    setSelectedVariant({ variantId: Number(event.target.value), variantPrice: Number(price) });
    setCartItem({ ...cartItem, variantId: Number(event.target.value), quantity: 1 });
  };
  const decQuantity = () => {
    if (cartItem.quantity > 1) {
      setCartItem({ ...cartItem, quantity: cartItem.quantity - 1 });
    }
  };
  const incQuantity = () => {
    if (cartItem.quantity < 100) {
      setCartItem({ ...cartItem, quantity: cartItem.quantity + 1 });
    }
  };
  const addToCart = async () => {
    const data = await fetch("/user/products/add-to-cart", {
      method: "POST",
      body: JSON.stringify({ cartItem }),
    });
    const response = await data.json();
    response.status === 200 ? toast.success(response.message) : toast.error(response.error);
    setProductDetails(null);
  };
  return (
    <div
      className="flex fixed bg-opacity-50 top-0 left-0 right-0 bg-black w-full md:h-full md:inset-0 h-[calc(100%-1rem)] z-50 "
      onClick={() => setProductDetails(null)}
    >
      <div className="relative w-2/3 h-min py-4 rounded-lg md:h-auto m-auto bg-white" onClick={(e) => e.stopPropagation()}>
        <div className="flex flex-row justify-between ml-7 mr-7">
          <div>
            <label className="md:text-xl font-bold">Name</label>
            <p>{productDetails.name}</p>
          </div>
          <div>
            <label className="md:text-xl font-bold">Price</label>
            {variants && variants.length > 0 ? <p>${selectedVariant.variantPrice}</p> : <p>${productDetails.price}</p>}
          </div>
        </div>
        {variants && variants.length > 0 ? (
          <div className="flex flex-col ml-7 my-2">
            <label className="md:text-xl font-bold">Options</label>
            <select className="relative w-1/3 right-1" onChange={(event) => handleVariantSelect(event)}>
              {variants.map((variant) => {
                return (
                  <option key={variant.id} value={variant.id} id={variant.price.toString()}>
                    {variant.name} - ${variant.price}
                  </option>
                );
              })}
            </select>
          </div>
        ) : null}
        <div className="flex items-center ml-7 my-2 font-bold">
          Qty:
          <span className="flex items-center ml-2 font-normal">
            <button onClick={decQuantity} disabled={!(cartItem.quantity > 1)}>
              <GrSubtract />
            </button>
            <span className="px-2">{cartItem.quantity}</span>
            <button onClick={incQuantity} disabled={!(cartItem.quantity < 100)}>
              <GrAdd />
            </button>
          </span>
        </div>
        <button className="bg-green-600 text-white rounded-2xl px-2 py-1 ml-7" onClick={addToCart}>
          Add to Cart
        </button>
      </div>
    </div>
  );
}
