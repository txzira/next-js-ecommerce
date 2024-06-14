import { Image as Img, CartItem } from "@prisma/client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { OrderSummary } from "types/ordersummary";
import Loader from "app/Loader";
import { KeyedMutator } from "swr";

export function OrderTable({
  setOrder,
  setCursor,
  setLimit,
  ordersData,
  ordersIsLoading,
  limit,
}: {
  setOrder: React.Dispatch<React.SetStateAction<OrderSummary>>;
  setCursor: React.Dispatch<React.SetStateAction<number>>;
  setLimit: React.Dispatch<React.SetStateAction<number>>;
  ordersData: {
    orders: OrderSummary[];
    count: number;
  };
  ordersIsLoading: boolean;
  limit: number;
}) {
  const [pages, setPages] = useState<number>();
  const [page, setPage] = useState<number>(1);
  useEffect(() => {
    if (ordersData?.count) {
      setPages(Math.ceil(Number(ordersData.count) / Math.abs(limit)));
    }
  }, [ordersData, limit]);

  const changeLimit = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    event.preventDefault();
    setLimit(Number(event.target.value));
    setPage(1);
    setCursor(0);
  };

  const PrevPage = () => {
    if (page > 1) {
      setCursor(ordersData.orders[0].id);
      if (limit > 0) {
        setLimit(limit * -1);
      }

      setPage(page - 1);
      setOrder(null);
    } else {
      toast.error("Request page out of bounds");
    }
  };
  const NextPage = () => {
    if (page < pages) {
      setCursor(ordersData.orders[ordersData.orders.length - 1].id);
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
    <div className="flex flex-col">
      <div className="flex flex-row justify-between items-center">
        <h1 className="text-4xl font-bold pb-5">Order List</h1>
        <select onChange={(event) => changeLimit(event)}>
          <option value="10" selected={true}>
            10
          </option>
          <option value="25">25</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
      </div>
      <div className="flex flex-col text-center border-2 border-black h-[500px] rounded-lg">
        <div className="grid grid-cols-4 items-center bg-black text-white font-bold h-12">
          <div className="py-2">Customer</div>
          <div className="py-2">Order Date</div>
          <div className="py-2">Total</div>
          <div className="py-2">Approved</div>
        </div>
        <div className="h-[400px] overflow-y-scroll bg-white">
          {!ordersIsLoading ? (
            ordersData.orders.length > 0 ? (
              ordersData.orders.map((order) => {
                const date = new Date(order.date);

                return (
                  <div key={order.id} className="grid grid-cols-4 items-center hover:bg-white h-12" onClick={() => setOrder(order)}>
                    <div className="pl-1 py-2 overflow-x-scroll">{`${order.customer.firstName} ${order.customer.lastName}`}</div>
                    <div className="py-2">{`${date.getMonth() + 1}/${date.getDate()}/${date
                      .getFullYear()
                      .toString()
                      .substring(2, 4)}`}</div>
                    <div className="py-2">${order.amount}</div>
                    <div className="py-2">{order.approved ? "Yes" : "No"}</div>
                  </div>
                );
              })
            ) : (
              <div>No Orders.</div>
            )
          ) : (
            <div className="flex justify-center py-5">
              <Loader />
            </div>
          )}
        </div>
        <div className="grid grid-cols-3 border-t-[1px] items-center border-black h-10 bg-white">
          <div className="py-2">{page > 1 ? <button onClick={() => PrevPage()}>&lt;-</button> : null}</div>
          {pages ? (
            <div>
              Page {page} of {pages}
            </div>
          ) : (
            <div>Page - of -</div>
          )}
          <div className="py-2">{page < pages ? <button onClick={() => NextPage()}>-&gt;</button> : null}</div>
        </div>
      </div>
    </div>
  );
}

export function OrderDetails({
  order,
  setOrder,
  ordersMutate,
}: {
  order: OrderSummary;
  setOrder: React.Dispatch<OrderSummary>;
  ordersMutate: KeyedMutator<{
    orders: OrderSummary[];
    count: number;
  }>;
}) {
  useEffect(() => {
    setOrderApproved(order.approved);
    order.trackingNumber === null ? setTrackingNumber("") : setTrackingNumber(order.trackingNumber);
  }, [order]);

  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [orderApproved, setOrderApproved] = useState<boolean>(false);
  async function saveOrder(event) {
    event.preventDefault();
    const data = await fetch("/admin/orders/save-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ orderId: order.id, approved: orderApproved, trackingNumber }),
    });
    const response = await data.json();
    ordersMutate();
    toast.success(response.message);
  }
  return order ? (
    <div
      className="flex fixed bg-opacity-50 top-0 left-0 right-0 bg-black w-full md:h-full md:inset-0 h-screen z-50 "
      onClick={() => setOrder(null)}
    >
      <div className="relative w-5/6 h-3/4 p-2 rounded-lg md:h-auto m-auto bg-white overflow-y-scroll" onClick={(e) => e.stopPropagation()}>
        <h1 className="text-4xl font-bold pb-5">Order Information</h1>

        {showDeleteConfirmationModal ? (
          <DeleteConfirmationModal
            orderId={order.id}
            ordersMutate={ordersMutate}
            setShowDeleteConfirmationModal={setShowDeleteConfirmationModal}
            setOrder={setOrder}
          />
        ) : null}
        <div>
          <h2 className="text-2xl font-bold underline">Customer Information</h2>
          <div>
            <div className="flex flex-col">
              <label className="font-semibold">Email</label>
              <span>{order.customer.email}</span>
            </div>
            <div className="flex flex-row gap-10">
              <div className="flex flex-col">
                <label className="font-semibold">First Name</label>
                <span>{order.customer.firstName}</span>
              </div>
              <div className="flex flex-col">
                <label className="font-semibold">Last Name</label>
                <span>{order.customer.lastName}</span>
              </div>
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold underline mb-2">Shipping</h2>
          <div className="flex flex-col">
            <label className="font-semibold">Full Name</label>
            <p>
              {order.shipping.firstName} {order.shipping.lastName}
            </p>
          </div>
          <div className="flex flex-col">
            <label className="font-semibold">Address</label>
            <p>
              {order.shipping.streetAddress} {order.shipping.streetAddress2} {order.shipping.city}, {order.shipping.state}{" "}
              {order.shipping.zipCode}
            </p>
          </div>
          <div className="flex flex-col w-64">
            <label className="font-semibold">Tracking Number</label>
            <input
              type="text"
              value={trackingNumber}
              placeholder="1Z999AA10123456784"
              onChange={(event) => setTrackingNumber(event.target.value)}
            />
          </div>
        </div>
        <h2 className="text-2xl font-bold underline mt-2">Products</h2>
        <div className="flex flex-col items-center">
          <ProductTable order={order} />
          {!order.isCash ? (
            <div>
              <h2 className="text-2xl font-bold underline text-center">Crypto Proof of Payment</h2>
              <Image src={order.image.url} height={200} width={600} alt="Proof of payment" className="my-5" />
            </div>
          ) : null}
          <div className="flex items-center gap-3 my-5">
            <span>Toggle Approval:</span>
            <label
              htmlFor="approval"
              className={`flex cursor-pointer ${
                orderApproved ? "bg-green-500" : "bg-gray-300"
              }  w-20 h-10 rounded-full relative items-center `}
            >
              <input
                type="checkbox"
                id="approval"
                className="sr-only peer"
                checked={orderApproved}
                onChange={() => setOrderApproved(!orderApproved)}
              />
              <span className="w-10 h-10 absolute bg-white rounded-full  peer-checked:left-10 shadow-xl"></span>
            </label>
          </div>
          <button
            type="button"
            className={`bg-blue-700 text-white rounded-full px-3 my-5 active:border-black active:border-2`}
            onClick={(event) => saveOrder(event)}
          >
            Save
          </button>
          <button
            type="button"
            className={`bg-red-700 text-white rounded-full px-3 my-5 active:border-black active:border-2`}
            onClick={() => setShowDeleteConfirmationModal(true)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  ) : null;

  function ProductTable({ order }: { order: OrderSummary }) {
    return (
      <table className="w-4/5 border-2 border-black text-center my-5">
        <tr className=" bg-black text-white border-2 border-black">
          <th>Name</th>
          <th>Quantity</th>
          <th>Price</th>
          <th>Total</th>
        </tr>
        {order.cart.cartItems.map((productObj: CartItem) => {
          return (
            <tr key={productObj.productName} className="border-b-[1px] border-black">
              <td>{productObj.productName}</td>
              <td>{productObj.quantity}</td>
              <td>${productObj.price}</td>
              <td>${Number(productObj.quantity) * Number(productObj.price)}</td>
            </tr>
          );
        })}
        <tr>
          <th>Total</th>
          <td></td>
          <td></td>
          <th>${order.amount}</th>
        </tr>
      </table>
    );
  }
}

function DeleteConfirmationModal({
  setShowDeleteConfirmationModal,
  orderId,
  setOrder,
  ordersMutate,
}: {
  setShowDeleteConfirmationModal: React.Dispatch<React.SetStateAction<boolean>>;
  orderId: number;
  setOrder: React.Dispatch<React.SetStateAction<OrderSummary>>;
  ordersMutate: KeyedMutator<{
    orders: OrderSummary[];
    count: number;
  }>;
}) {
  const deleteOrder = async (event) => {
    event.preventDefault();
    toast.loading("Loading...");

    const response = await fetch(`/admin/orders/delete-order/${orderId}`, {
      method: "DELETE",
    });
    const message = await response.json();
    toast.dismiss();
    ordersMutate();
    setOrder(null);
    setShowDeleteConfirmationModal(false);
    response.status ? toast.success(message) : toast.error(message);
  };

  function closeOnEscKeyDown(event) {
    if ((event.charCode || event.keyCode) === 27) {
      setShowDeleteConfirmationModal(false);
    }
  }
  useEffect(() => {
    document.body.addEventListener("keydown", closeOnEscKeyDown);
    return function cleanup() {
      document.body.removeEventListener("keydown", closeOnEscKeyDown);
    };
  });

  return (
    <div
      className="flex fixed bg-opacity-50 top-0 left-0 right-0 p-4 overflow-x-hidden overflow-y-auto bg-black w-full md:h-full md:inset-0 h-[calc(100%-1rem)] z-50 "
      onClick={() => setShowDeleteConfirmationModal(false)}
    >
      <div className="relative w-1/3 h-full max-w-2xl md:h-auto m-auto " onClick={(e) => e.stopPropagation()}>
        <div className=" flex flex-col items-center relative bg-white rounded-lg shadow dark:bg-gray-700 ">
          <h1 className="text-lg p-2">Are you sure you wanted to delete this order? This action is irreversible and cannot be canceled.</h1>
          <div className="flex flex-row gap-8 p-2">
            <button
              className=" p-2 rounded-full border-2 text-lg border-black bg-gray-400 text-white hover:shadow-lg hover:-translate-y-2 "
              onClick={() => setShowDeleteConfirmationModal(false)}
            >
              Cancel
            </button>
            <button
              className=" p-2 rounded-full border-2 text-lg border-black bg-red-600 text-white hover:shadow-lg hover:-translate-y-2"
              onClick={(event) => deleteOrder(event)}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
