"use client";
import React, { useEffect, useState } from "react";
import { CartItem, Category, Product as Prod, ProductVariant } from "@prisma/client";

import { useSession } from "next-auth/react";
import useSWR from "swr";
import Image from "next/image";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Loader from "app/Loader";

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
}: {
  wallets: {
    id: number;
    address: string;
    type: {
      name: string;
    };
  }[];
}) {
  const [productDetails, setProductDetails] = useState<
    Prod & {
      category: Category;
      productVariants: ProductVariant[];
    }
  >(null);

  return (
    <div>
      <ProductTable setProductDetails={setProductDetails} />
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
    <div className="grid grid-cols-3 text-sm md:text-base hover:bg-slate-200 cursor-pointer" onClick={() => setProductDetails(product)}>
      <input hidden name="id" value={product.id} />
      <div className="px-2 text-center">{product.name}</div>
      <div className="px-2 text-center">{product.price}</div>
      <div className="px-2 text-center">{product.category ? product.category.name : null}</div>
    </div>
  );
}

function ProductTable({
  setProductDetails,
}: {
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

  const { data: session, status } = useSession();
  const router = useRouter();

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
    <div className="flex flex-col w-5/6 md:w-3/5 items-center mx-auto justify-center gap-4">
      <h1 className="text-center my-2 text-base md:text-2xl  font-semibold">Products</h1>
      <div className="w-full border-black border-2">
        <div className="grid grid-cols-3 font-bold text-sm md:text-base text-center bg-black text-white">
          <div className="md:px-2">Name</div>
          <div className="md:px-2">Price</div>
          <div className="md:px-2">Category</div>
        </div>
        {!productsIsLoading ? (
          productsData.products.map(
            (
              productData: Prod & {
                category: Category;
                productVariants: ProductVariant[];
              }
            ) => {
              return <Product key={productData.id} product={productData} setProductDetails={setProductDetails} />;
            }
          )
        ) : (
          <div className="flex justify-center py-5">
            <Loader />
          </div>
        )}
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
  const [product, setProduct] = useState<
    Prod & {
      category: Category;
      productVariants: ProductVariant[];
    }
  >();
  const [cartItem, setCartItem] = useState<CartItem>();

  useEffect(() => {
    setProduct(productDetails);
  }, [productDetails]);
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
          <p>{productDetails.price}</p>
        </div>
        <div>
          <label>Options</label>
          <select>
            <option value={null}>--Select Option--</option>
            {variants
              ? variants.map((variant) => {
                  return (
                    <option value={variant.id}>
                      {variant.name} - ${variant.price}
                    </option>
                  );
                })
              : null}
          </select>
        </div>
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
