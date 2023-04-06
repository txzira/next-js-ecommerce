import { Order, orderProduct, Product, Image as Img, ShippingAddress } from "@prisma/client";
import Loader from "app/Loader";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useSWR from "swr";

export function AccountInformation() {
  const session = useSession();
  // const [currentPassword, setCurrentPassword] = useState("");
  // const [newPassword, setNewPassword] = useState("");
  // const [confirmPassword, setConfirmPassword] = useState("");

  // const changePassword = async (event) => {
  //   event.preventDefault();
  //   if (newPassword === confirmPassword) {
  //     const data = await fetch("/user/account/change-password", {
  //       method: "POST",
  //       body: JSON.stringify({ currentPassword, newPassword }),
  //     });
  //     // const response = await data.json();
  //     // console.log();
  //   } else {
  //     toast.error("New passwords do not match");
  //   }
  // };

  return (
    <div className="w-1/3">
      <h1 className="text-4xl font-bold pb-5">Customer Information</h1>
      <div className="flex flex-row justify-between">
        <div>
          <h2 className="text-lg font-semibold">Full Name</h2>
          <div>{session.data?.user.name}</div>
        </div>
        <div>
          <h2 className="text-lg font-semibold">Email</h2>
          <div>{session.data?.user.email}</div>
        </div>
      </div>
      {/* <form className="border-[1px] border-black p-2">
        <h1 className="text-lg font-semibold">Change Password</h1>
        <div className="flex flex-col w-1/2 pb-2">
          <label>Current Password</label>
          <input
            type="password"
            className="border-[1px] border-black"
            value={currentPassword}
            onChange={(event) => setCurrentPassword(event.target.value)}
          />
        </div>
        <div className="flex flex-col w-1/2 pb-2">
          <label>New Password</label>
          <input
            type="password"
            className="border-[1px] border-black"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
          />
        </div>
        <div className="flex flex-col w-1/2 pb-2">
          <label>Re-type New Password</label>
          <input
            type="password"
            className="border-[1px] border-black"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
          />
        </div>
        <button className="bg-blue-800 text-white rounded-full p-2" onClick={(event) => changePassword(event)}>
          Change Password
        </button>
      </form> */}
    </div>
  );
}

export function AccountHistory({
  order,
  setOrder,
}: {
  order: Order & {
    products: (orderProduct & {
      product: Product;
    })[];
    shipping: ShippingAddress;
  };
  setOrder: React.Dispatch<
    React.SetStateAction<
      Order & {
        products: (orderProduct & {
          product: Product;
        })[];
        shipping: ShippingAddress;
      }
    >
  >;
}) {
  const [pages, setPages] = useState<number>();
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState(10);
  const [cursor, setCursor] = useState(0);
  const [sort, setSort] = useState("asc");
  const fetcher = (url) => fetch(url, { method: "GET" }).then((res) => res.json());
  const { data, error, isLoading } = useSWR(`/user/account/get-customer-order/${limit}/${cursor}/${sort}`, fetcher);
  useEffect(() => {
    if (data?.count) {
      setPages(Math.ceil(Number(data.count) / Math.abs(limit)));
    }
  }, [data, limit]);
  const changeLimit = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    event.preventDefault();
    setLimit(Number(event.target.value));
    setPage(1);
    setCursor(0);
  };

  const prevPage = () => {
    if (page > 1) {
      setCursor(data.userOrders[0].id);
      if (limit > 0) {
        setLimit(limit * -1);
      }

      setPage(page - 1);
      setOrder(null);
    } else {
      toast.error("Request page out of bounds");
    }
  };
  const nextPage = () => {
    if (page < pages) {
      setCursor(data.userOrders[data.userOrders.length - 1].id);
      if (limit < 0) {
        setLimit(limit * -1);
      }
      setPage(page + 1);
      setOrder(null);
    } else {
      toast.error("Request page out of bounds");
    }
  };

  return (
    <div className="flex flex-col md:w-1/3 p-5">
      <div className="flex flex-row sm justify-between items-center">
        <h1 className="text-base md:text-4xl font-bold pb-5">Order List</h1>
        <select onChange={(event) => changeLimit(event)}>
          <option value="10" selected={true}>
            10
          </option>
          <option value="25">25</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
      </div>
      <div className="container border-2  border-black text-center h-[500px]  w-auto">
        <div className="">
          <div className="grid grid-cols-6 bg-black text-white h-12 font-bold items-center ">
            <div className="md:px-1">Order #</div>
            <div className="md:px-1">Date</div>
            <div className="md:px-1">Total</div>
            <div className="md:px-1">Order Status</div>
            <div className="md:px-1">Shipping</div>
            <div className="md:px-1">Tracking#</div>
          </div>
          <div className="h-[400px] overflow-y-scroll">
            {!isLoading ? (
              data.userOrders.map(
                (
                  order: Order & {
                    products: (orderProduct & {
                      product: Product;
                    })[];
                    shipping: ShippingAddress;
                  }
                ) => {
                  return (
                    <div
                      className="grid grid-cols-6 text-sm hover:bg-white cursor-pointer h-10 items-center"
                      key={order.id}
                      onClick={() => setOrder(order)}
                    >
                      <div className="py-2">{order.id}</div>
                      <div className="py-2">{new Date(order.date).toDateString()}</div>
                      <div className="py-2">${order.amount}</div>
                      <div className="py-2">{order.approved ? "Approved" : "Pending"}</div>
                      <div className="py-2">{order.trackingNumber ? "Shipped" : "Pending"}</div>
                      <div className="py-2">{order.trackingNumber}</div>
                    </div>
                  );
                }
              )
            ) : (
              <div className="flex justify-center py-5">
                <Loader />
              </div>
            )}
          </div>
        </div>
        <div className="grid grid-cols-3 border-t-[1px] items-center border-black h-10">
          <div className="py-2">{page > 1 ? <button onClick={() => prevPage()}>&lt;-</button> : null}</div>
          {pages ? (
            <div>
              Page {page} of {pages}
            </div>
          ) : (
            <div>Page - of -</div>
          )}
          <div className="py-2">{page < pages ? <button onClick={() => nextPage()}>-&gt;</button> : null}</div>
        </div>
      </div>
    </div>
  );
}

export function OrderDetails({
  order,
}: {
  order: Order & {
    image: Img;
    products: (orderProduct & {
      product: Product;
    })[];
    shipping: ShippingAddress;
  };
}) {
  // console.log(window.matchMedia("(min-width: 768px)").matches);
  return (
    <div>
      <h1 className="text-4xl font-bold pb-5">Order Details</h1>

      {order ? (
        <div>
          <div className="flex flex-col">
            <h2 className="font-semibold text-lg">Full Name</h2>
            <div>
              {order.shipping.firstName} {order.shipping.lastName}
            </div>
          </div>
          <div className="flex flex-col">
            <label className="text-lg font-semibold">Address</label>
            <div>
              {order.shipping.streetAddress} {order.shipping.streetAddress2} {order.shipping.city}, {order.shipping.state}{" "}
              {order.shipping.zipCode}
            </div>
          </div>
          <div className="flex flex-row justify-between">
            <div>
              <h2 className="font-semibold text-lg">Order Date</h2>
              <div>{new Date(order.date).toLocaleDateString()}</div>
            </div>
            <div>
              <h2 className="font-semibold text-lg">Tracking Number</h2>
              <div>{order.trackingNumber ? order.trackingNumber : "N/A"}</div>
            </div>
          </div>
          <div>
            <h2 className="font-semibold text-lg text-center py-2">Product List</h2>
            <div className="flex flex-col text-center border-black border-2">
              <div className="grid grid-cols-4 bg-black text-white font-bold h-12 items-center">
                <div className="p-3">Name</div>
                <div className="p-3">Quantity</div>
                <div className="p-3">Price per</div>
                <div className="p-3">Total</div>
              </div>
              {order.products.map((orderProduct) => {
                return (
                  <div key={orderProduct.productId} className="grid grid-cols-4 h-10">
                    <div className="py-2">{orderProduct.product.name}</div>
                    <div className="py-2">{orderProduct.quantity}</div>
                    <div className="py-2">${orderProduct.pricePaidPer}</div>
                    <div className="py-2">${orderProduct.pricePaidPer * orderProduct.quantity}</div>
                  </div>
                );
              })}
            </div>
          </div>
          {order.image ? (
            <div>
              <h2 className="text-center font-semibold text-lg py-2">Crypto Proof of Payment Image</h2>
              <Image src={order.image.url} height={200} width={500} alt="Proof of payment" />
            </div>
          ) : (
            <div className="text-center font-semibold text-lg py-2">Cash Payment Order</div>
          )}
        </div>
      ) : (
        <div>Click on an order for more information</div>
      )}
    </div>
  );
}
