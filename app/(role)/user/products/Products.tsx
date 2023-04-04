"use client";
import React, { useEffect, useState } from "react";

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

function Product({ product }) {
  const [quantity, setQuantity] = useState(0);
  return (
    <div className="grid grid-cols-3 text-sm md:text-base">
      <input hidden name="id" value={product.id} />
      <div className="">
        <input className="px-2 w-full text-center bg-inherit focus:outline-none" type="text" name="name" value={product.name} readOnly />
      </div>
      <div className="">
        <input
          className="px-2 w-full text-center bg-inherit focus:outline-none"
          type="number"
          name="price"
          value={product.price}
          readOnly
        />
      </div>
      <div className="">
        <input
          className="px-2 w-full text-center bg-white border-b-[1px] border-l-[1px]  border-black"
          type="number"
          name="quantity"
          value={quantity}
          onChange={(event) => setQuantity(parseInt(event.target.value))}
        />
      </div>
    </div>
  );
}

export function ProductTable({
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
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [streetAddress2, setStreetAddress2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");

  const [image, setImage] = useState<any>();
  const [imageName, setImageName] = useState("");

  const { data: session, status } = useSession();
  const fetcher = (url) => fetch(url).then((res) => res.json());
  const { data, error, isLoading } = useSWR("/api/admin/product/get-products", fetcher);
  const router = useRouter();

  const setFileToBase = (file) => {
    const reader = new FileReader();
    setImageName(file.name);
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImage(reader.result);
    };
  };
  const handleImage = (event) => {
    const file = event.target.files[0];
    setFileToBase(file);
  };

  async function submitForm(event) {
    event.preventDefault();
    const ids: any = document.getElementsByName("id");
    const names: any = document.getElementsByName("name");
    const prices: any = document.getElementsByName("price");
    const quantities: any = document.getElementsByName("quantity");
    const cart = [];
    for (let i = 0; i < prices.length; i++) {
      if (quantities[i].value > 0) {
        cart.push({
          id: ids[i].value,
          name: names[i].value,
          price: prices[i].value,
          quantity: quantities[i].value,
          pricePaidPer: prices[i].value,
        });
      }
    }
    let orderResponse: any = await fetch("/api/customer/order/create-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cart, customerId: session.user.id, imagePath: image, imageName: imageName }),
    });
    orderResponse = await orderResponse.json();
    if (orderResponse.status === "ok") {
      toast.success(orderResponse.message);
      router.push("/");
    } else toast.error(orderResponse.message);
  }

  return (
    <>
      <form className="flex flex-col w-5/6 md:w-2/5 items-center mx-auto justify-center gap-4" id="order" onSubmit={submitForm}>
        <h1 className="text-center py-6 text-base md:text-2xl  font-semibold">Products</h1>
        <div className="w-full border-black border-2">
          <div className="grid grid-cols-3 font-bold text-sm md:text-base text-center bg-black text-white">
            <div className="md:px-2">Name</div>
            <div className="md:px-2">Price</div>
            <div className="md:px-2">Quanity</div>
          </div>
          {!isLoading ? (
            data.products.map((product) => {
              return <Product key={product.id} product={product} />;
            })
          ) : (
            <div>
              <Loader />
            </div>
          )}
        </div>
        <div className="flex flex-col">
          <h2 className="text-2xl font-semibold text-center">Shipping</h2>
          <div className="flex flex-row">
            <div className="flex flex-col">
              <label className="font-semibold md:text-lg" htmlFor="firstName">
                First Name
              </label>
              <input
                required={true}
                id="firstName"
                value={firstName}
                placeholder="John"
                onChange={(event) => setFirstName(event.target.value)}
              />
            </div>
            <div className="flex flex-col">
              <label className="font-semibold md:text-lg" placeholder="Smith" htmlFor="lastName">
                Last Name
              </label>
              <input required={true} id="lastName" value={lastName} onChange={(event) => setLastName(event.target.value)} />
            </div>
          </div>

          <div className="flex flex-row">
            <div className="flex flex-col">
              <label className="font-semibold md:text-lg" htmlFor="streetAddress">
                Street Address
              </label>
              <input
                required={true}
                id="streetAddress"
                value={streetAddress}
                placeholder="123 Rainy St."
                onChange={(event) => setStreetAddress2(event.target.value)}
              />
            </div>
            <div className="flex flex-col">
              <label className="font-semibold md:text-lg" htmlFor="streetAddress2">
                Street Address 2
              </label>
              <input
                id="streetAddress2"
                value={streetAddress2}
                placeholder="Apt. 2"
                onChange={(event) => setStreetAddress2(event.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-row">
            <div className="flex flex-col w-4/6">
              <label className="font-semibold md:text-lg" htmlFor="city">
                City
              </label>
              <input required={true} id="city" value={city} placeholder="Beckley" onChange={(event) => setCity(event.target.value)} />
            </div>
            <div className="flex flex-col">
              <label className="font-semibold md:text-lg" htmlFor="state">
                State
              </label>
              <select id="state" onChange={(event) => setState(event.target.value)}>
                {states.map((state) => {
                  return <option value={state.code}>{state.name}</option>;
                })}
              </select>
            </div>
            <div className="flex flex-col">
              <label className="font-semibold md:text-lg" htmlFor="zipCode">
                Zip
              </label>
              <input required={true} id="zipCode" value={zip} placeholder="25919" onChange={(event) => setZip(event.target.value)} />
            </div>
          </div>
        </div>

        <div>
          <div>
            <h2 className="text-2xl font-semibold text-center">Payment</h2>
          </div>
          <h3 className="text-lg font-semibold">Wallet Addresses</h3>
          {wallets.length > 0 ? (
            wallets.map((wallet) => {
              return (
                <div key={wallet.id} className="flex flex-row gap-6">
                  <div>{wallet.type.name}</div>
                  <div>{wallet.address} </div>
                </div>
              );
            })
          ) : (
            <div>Admin has not set wallet address(es)</div>
          )}
          <span className="text-sm">
            Note: Send payment to one of these addresses. Screenshot the transaction between your wallet address and one of these addresses
            and attach it as your proof of payment image.
          </span>
        </div>
        <span>
          <u className="font-semibold">Crypto Proof of Payment Image</u>
        </span>
        <div>
          <label htmlFor="productImage" className="text-sm">
            Select an Image:
          </label>
          <input type="file" id="productImage" onChange={handleImage} />
        </div>
        {image ? <Image id="preview" src={image} alt="payment preview" width={250} height={100} /> : null}
        <div className="w-full">
          <h3 className="text-lg font-semibold">Cash Address</h3>
          <span className="text-sm">If you wish to pay with cash, send it to the address below.</span>
          <div className="text-sm">
            <p>Fabian P.</p>
            <p>325 N Larchmont Blvd, Los Angeles, CA 90004</p>
          </div>
        </div>
        <p>ORDERS WILL NOT SHIP UNTIL PAYMENT IS RECEIVED/VERIFIED.</p>
        <button className="bg-blue-900 text-white rounded-2xl px-3 py-1" type="submit">
          Submit Order
        </button>
      </form>
    </>
  );
}

function Shipping() {
  const [firstName, setFirstName] = useState("");
  return (
    <div>
      <div className="flex flex-row">
        <div>
          <label>First Name</label>
          <input />
        </div>
        <div>
          <label>Last Name</label>
          <input />
        </div>

        <div>
          <label>Shipping Address</label>
          <input />
        </div>
        <div>
          <div>
            <label>City</label>
            <input />
          </div>
          <div>
            <label>State</label>
            <select>
              {states.map((state) => {
                return <option value={state.code}>{state.name}</option>;
              })}
            </select>
          </div>

          <div>
            <label>Zip</label>
            <input />
          </div>
        </div>
      </div>
    </div>
  );
}
