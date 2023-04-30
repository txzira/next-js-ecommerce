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
const states = [
  {
    name: "Alabama",
    code: "AL",
  },
  {
    name: "Alaska",
    code: "AK",
  },
  {
    name: "Arizona",
    code: "AZ",
  },
  {
    name: "Arkansas",
    code: "AR",
  },
  {
    name: "California",
    code: "CA",
  },
  {
    name: "Colorado",
    code: "CO",
  },
  {
    name: "Connecticut",
    code: "CT",
  },
  {
    name: "Delaware",
    code: "DE",
  },
  {
    name: "Florida",
    code: "FL",
  },
  {
    name: "Georgia",
    code: "GA",
  },
  {
    name: "Hawaii",
    code: "HI",
  },
  {
    name: "Idaho",
    code: "ID",
  },
  {
    name: "Illinois",
    code: "IL",
  },
  {
    name: "Indiana",
    code: "IN",
  },
  {
    name: "Iowa",
    code: "IA",
  },
  {
    name: "Kansas",
    code: "KS",
  },
  {
    name: "Kentucky",
    code: "KY",
  },
  {
    name: "Louisiana",
    code: "LA",
  },
  {
    name: "Maine",
    code: "ME",
  },
  {
    name: "Maryland",
    code: "MD",
  },
  {
    name: "Massachusetts",
    code: "MA",
  },
  {
    name: "Michigan",
    code: "MI",
  },
  {
    name: "Minnesota",
    code: "MN",
  },
  {
    name: "Mississippi",
    code: "MS",
  },
  {
    name: "Missouri",
    code: "MO",
  },
  {
    name: "Montana",
    code: "MT",
  },
  {
    name: "Nebraska",
    code: "NE",
  },
  {
    name: "Nevada",
    code: "NV",
  },
  {
    name: "New Hampshire",
    code: "NH",
  },
  {
    name: "New Jersey",
    code: "NJ",
  },
  {
    name: "New Mexico",
    code: "NM",
  },
  {
    name: "New York",
    code: "NY",
  },
  {
    name: "North Carolina",
    code: "NC",
  },
  {
    name: "North Dakota",
    code: "ND",
  },
  {
    name: "Ohio",
    code: "OH",
  },
  {
    name: "Oklahoma",
    code: "OK",
  },
  {
    name: "Oregon",
    code: "OR",
  },
  {
    name: "Pennsylvania",
    code: "PA",
  },
  {
    name: "Rhode Island",
    code: "RI",
  },
  {
    name: "South Carolina",
    code: "SC",
  },
  {
    name: "South Dakota",
    code: "SD",
  },
  {
    name: "Tennessee",
    code: "TN",
  },
  {
    name: "Texas",
    code: "TX",
  },
  {
    name: "Utah",
    code: "UT",
  },
  {
    name: "Vermont",
    code: "VT",
  },
  {
    name: "Virginia",
    code: "VA",
  },
  {
    name: "Washington",
    code: "WA",
  },
  {
    name: "West Virginia",
    code: "WV",
  },
  {
    name: "Wisconsin",
    code: "WI",
  },
  {
    name: "Wyoming",
    code: "WY",
  },
];

export function ProductPage({
  wallets,
  categories,
}: {
  wallets: {
    id: number;
    address: string;
    type: {
      name: string;
    };
  }[];
  categories: Category[];
}) {
  const [productDetails, setProductDetails] = useState<
    Prod & {
      category: Category;
      productVariants: ProductVariant[];
    }
  >(null);

  return (
    <div className="z-0">
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
  console.log(product);

  const [quantity, setQuantity] = useState(0);
  return (
    <div className="grid grid-cols-5 items-center text-base even:bg-slate-200  h-10 ">
      <div className="text-center col-span-2">{product.name}</div>
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

  const [image, setImage] = useState<any>();
  const [imageName, setImageName] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [products, setProducts] = useState<
    (Prod & {
      category: Category;
      productVariants: ProductVariant[];
    })[]
  >();

  const { data: session, status } = useSession();
  const router = useRouter();
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
  }, [categoryFilter]);
  // const setFileToBase = (file) => {
  //   const reader = new FileReader();
  //   setImageName(file.name);
  //   reader.readAsDataURL(file);
  //   reader.onloadend = () => {
  //     setImage(reader.result);
  //   };
  // };
  // const handleImage = (event) => {
  //   const file = event.target.files[0];
  //   setFileToBase(file);
  // };

  // async function submitForm(event) {
  //   event.preventDefault();
  //   const ids: any = document.getElementsByName("id");
  //   const names: any = document.getElementsByName("name");
  //   const prices: any = document.getElementsByName("price");
  //   const quantities: any = document.getElementsByName("quantity");
  //   const cart = [];
  //   toast.loading("Loading...");
  //   for (let i = 0; i < prices.length; i++) {
  //     if (quantities[i].value > 0) {
  //       cart.push({
  //         id: ids[i].value,
  //         name: names[i].value,
  //         price: prices[i].value,
  //         quantity: quantities[i].value,
  //         pricePaidPer: prices[i].value,
  //       });
  //     }
  //   }
  //   let orderResponse: any = await fetch("/api/customer/order/create-order", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({ cart, customerId: session.user.id, imagePath: image, imageName: imageName, shipping }),
  //   });
  //   orderResponse = await orderResponse.json();
  //   toast.dismiss();
  //   if (orderResponse.status === "ok") {
  //     toast.success(orderResponse.message);
  //     router.push("/");
  //   } else toast.error(orderResponse.message);
  // }

  return (
    <div>
      <h1 className="text-center my-2 text-base md:text-2xl  font-semibold">Menu</h1>
      <div className=" w-5/6 md:w-3/5  mx-auto gap-4 ">
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
        {/* <nav className="flex flex-row border-black border-2 w-min h-10 rounded-t-xl bg-white shadow-[10px_10px_10px_5px_rgb(0,0,0,0.15)] ">
          <button
            className={`${categoryFilter === "All" ? "bg-black text-white rounded-tl-lg" : ""} p-2`}
            onClick={() => setCategoryFilter("All")}
          >
            All
          </button>
          {categories.map((category) => {
            return (
              <button
                className={`${categoryFilter == category.name ? "bg-black text-white  " : ""} px-2 text-sm last:rounded-tr-lg`}
                onClick={() => setCategoryFilter(category.name)}
              >
                {category.name}
              </button>
            );
          })}
        </nav> */}
        <div className=" rounded-b-xl  border-black border-2 shadow-[10px_10px_10px_5px_rgb(0,0,0,0.15)] bg-white ">
          <div className="grid grid-cols-5 h-12 items-center font-bold text-sm md:text-base text-center bg-black text-white md:pr-4">
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
      console.log(variants[0].id);
    } else {
      setCartItem({ ...cartItem, productId: productDetails.id });
    }
    // setProduct(productDetails);
  }, [productDetails]);

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
    console.log(cartItem);
    const data = await fetch("/user/products/add-to-cart", {
      method: "POST",
      body: JSON.stringify({ cartItem }),
    });
    const response = await data.json();
    response.status === 200 ? toast.success(response.message) : toast.error(response.error);
    setProductDetails(null);
  };
  console.log(productDetails);
  return (
    <div
      className="flex fixed bg-opacity-50 top-0 left-0 right-0 bg-black w-full md:h-full md:inset-0 h-[calc(100%-1rem)] z-50 "
      onClick={() => setProductDetails(null)}
    >
      <div className="relative w-1/3 h-full p-2 rounded-lg md:h-auto m-auto bg-white" onClick={(e) => e.stopPropagation()}>
        <div className="">
          <label className="md:text-xl font-semibold">Name</label>
          <p>{productDetails.name}</p>
        </div>
        <div>
          <label className="md:text-xl font-semibold">Price</label>
          {variants && variants.length > 0 ? <p>${selectedVariant.variantPrice}</p> : <p>${productDetails.price}</p>}
        </div>
        {variants && variants.length > 0 ? (
          <div className="flex flex-col">
            <label className="md:text-xl font-semibold">Options</label>
            <select className="w-1/3" onChange={(event) => handleVariantSelect(event)}>
              {variants.map((variant) => {
                return (
                  <option value={variant.id} id={variant.price.toString()}>
                    {variant.name} - ${variant.price}
                  </option>
                );
              })}
            </select>
          </div>
        ) : null}
        <div>
          <button onClick={decQuantity} disabled={!(cartItem.quantity > 1)}>
            <GrSubtract />
          </button>
          <span>{cartItem.quantity}</span>
          <button onClick={incQuantity} disabled={!(cartItem.quantity < 100)}>
            <GrAdd />
          </button>
        </div>
        <button className="bg-blue-900 text-white rounded-2xl px-2 py-1" onClick={addToCart}>
          Add to Cart
        </button>
      </div>
    </div>
  );
}

// function WalletList({
//   wallets,
// }: {
//   wallets: {
//     id: number;
//     address: string;
//     type: {
//       name: string;
//     };
//   }[];
// }) {
//   return (
//     <div>
//       <h3 className="text-lg font-semibold">Wallet Addresses</h3>
//       {wallets.length > 0 ? (
//         wallets.map((wallet) => {
//           return (
//             <div key={wallet.id} className="flex flex-row gap-6">
//               <div>{wallet.type.name}</div>
//               <div>{wallet.address} </div>
//             </div>
//           );
//         })
//       ) : (
//         <div>Admin has not set wallet address(es)</div>
//       )}
//     </div>
//   );
// }

// function ShippingForm() {
//   const initialShipping = { firstName: "", lastName: "", streetAddress: "", streetAddress2: "", city: "", state: "AL", zipCode: "" };

//   const [shipping, setShipping] = useState(initialShipping);

//   return (
//     <div>
//       <div className="w-full mx-auto">
//         <h2 className="text-2xl font-semibold text-center">Shipping</h2>
//         <div className="flex flex-row">
//           <div className="flex flex-col">
//             <label className="font-semibold text-sm md:text-lg" htmlFor="firstName">
//               First Name
//             </label>
//             <input
//               required={true}
//               className="text-xs md:text-base"
//               id="firstName"
//               value={shipping.firstName}
//               placeholder="John"
//               onChange={(event) => setShipping({ ...shipping, firstName: event.target.value })}
//             />
//           </div>
//           <div className="flex flex-col">
//             <label className="font-semibold text-sm md:text-lg" htmlFor="lastName">
//               Last Name
//             </label>
//             <input
//               required={true}
//               className="text-xs md:text-base"
//               id="lastName"
//               value={shipping.lastName}
//               placeholder="Smith"
//               onChange={(event) => setShipping({ ...shipping, lastName: event.target.value })}
//             />
//           </div>
//         </div>

//         <div className="flex flex-row">
//           <div className="flex flex-col">
//             <label className="font-semibold text-sm md:text-lg" htmlFor="streetAddress">
//               Street Address
//             </label>
//             <input
//               required={true}
//               className="text-xs md:text-base"
//               id="streetAddress"
//               value={shipping.streetAddress}
//               placeholder="123 Rainy St."
//               onChange={(event) => setShipping({ ...shipping, streetAddress: event.target.value })}
//             />
//           </div>
//           <div className="flex flex-col">
//             <label className="font-semibold text-sm md:text-lg" htmlFor="streetAddress2">
//               Street Address 2
//             </label>
//             <input
//               className="text-xs md:text-base"
//               id="streetAddress2"
//               value={shipping.streetAddress2}
//               placeholder="Apt. 2"
//               onChange={(event) => setShipping({ ...shipping, streetAddress2: event.target.value })}
//             />
//           </div>
//         </div>

//         <div className="flex flex-row">
//           <div className="flex flex-col ">
//             <label className="font-semibold text-sm md:text-lg" htmlFor="city">
//               City
//             </label>
//             <input
//               required={true}
//               className="text-xs md:text-base"
//               id="city"
//               value={shipping.city}
//               placeholder="Beckley"
//               onChange={(event) => setShipping({ ...shipping, city: event.target.value })}
//             />
//           </div>
//           <div className="flex flex-col">
//             <label className="font-semibold text-sm md:text-lg" htmlFor="state">
//               State
//             </label>
//             <select
//               className="text-xs md:text-base"
//               id="state"
//               onChange={(event) => setShipping({ ...shipping, state: event.target.value })}
//             >
//               {states.map((state) => {
//                 return (
//                   <option key={state.code} value={state.code}>
//                     {state.name}
//                   </option>
//                 );
//               })}
//             </select>
//           </div>
//           <div className="flex flex-col">
//             <label className="font-semibold text-sm md:text-lg" htmlFor="zipCode">
//               Zip
//             </label>
//             <input
//               required={true}
//               className="text-xs md:text-base"
//               id="zipCode"
//               value={shipping.zipCode}
//               placeholder="25919"
//               onChange={(event) => setShipping({ ...shipping, zipCode: event.target.value })}
//             />
//           </div>
//         </div>
//       </div>

//       <div>
//         <div>
//           <h2 className="text-2xl font-semibold text-center">Payment</h2>
//         </div>

//         <span className="text-xs md:text-sm">
//           Note: Screenshot the transaction between your wallet address and one of these addresses and attach it as your proof of payment
//           image, leave image blank if cash order.
//         </span>
//       </div>
//       <span>
//         <u className="font-semibold">Crypto Proof of Payment Image</u>
//       </span>
//       <div>
//         <label htmlFor="productImage" className="text-sm">
//           Select an Image:
//         </label>
//         <input type="file" id="productImage" onChange={handleImage} />
//       </div>
//       {image ? <Image id="preview" src={image} alt="payment preview" width={250} height={100} /> : null}
//       <div className="w-full">
//         <h3 className="text-lg font-semibold">Cash Address</h3>
//         <span className="text-sm">If you wish to pay with cash, send it to the address below.</span>
//         <div className="text-xs md:text-sm">
//           <p>Fabian P.</p>
//           <p>325 N Larchmont Blvd, Los Angeles, CA 90004</p>
//         </div>
//       </div>
//       <p>ORDERS WILL NOT SHIP UNTIL PAYMENT IS RECEIVED/VERIFIED.</p>
//       <button className="bg-blue-900 text-white rounded-2xl px-3 py-1" type="submit">
//         Submit Order
//       </button>
//     </div>
//   );
// }
