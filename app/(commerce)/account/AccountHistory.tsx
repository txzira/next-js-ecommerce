import { Order, Product, Image as Img, ShippingAddress, Cart, CartItem } from "@prisma/client";
import Loader from "app/Loader";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { validatePassword } from "pages/api/auth/[...nextauth]";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from "react-icons/ai";
import useSWR from "swr";

export function AccountInformation() {
  const initalErrors = {
    uppercaseError: {
      error: "Must include at least 1 uppercase letter",
      status: false,
    },
    lowercaseError: { error: "Must include at least 1 lowercase letter.", status: false },
    numberError: {
      error: "Must include at least 1 number.",
      status: false,
    },
    specialCharError: {
      error: "Must include at least 1 special character (!@#$%^&*).",
      status: false,
    },
    lengthError: {
      error: "Must be between 8-16 characters.",
      status: false,
    },
  };
  const session = useSession();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [formErrors, setFormErrors] = useState(initalErrors);
  const [showErrors, setShowErrors] = useState(false);
  const [showNewPassValidationMark, setShowNewPassValidationMark] = useState(false);
  const [showConPassValidationMark, setShowConPassValidationMark] = useState(false);

  const [passwordValid, setPasswordValid] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(false);
  const [unfocused, setUnfocused] = useState(false);

  const handleErrors = (password) => {
    const errors = initalErrors;
    //uppercase validation
    password.match(/(?=.*[A-Z])/) ? (errors.uppercaseError.status = true) : (errors.uppercaseError.status = false);
    //lowercase validation
    password.match(/(?=.*[a-z])/) ? (errors.lowercaseError.status = true) : (errors.lowercaseError.status = false);
    //number validation
    password.match(/(?=.*\d)/) ? (errors.numberError.status = true) : (errors.numberError.status = false);
    //special character validation
    password.match(/(?=.*[!@#$%^&*])/) ? (errors.specialCharError.status = true) : (errors.specialCharError.status = false);
    //length validation
    password.match(/^.{8,16}$/) ? (errors.lengthError.status = true) : (errors.lengthError.status = false);
    validatePassword(password) ? setPasswordValid(true) : setPasswordValid(false);
    setFormErrors(errors);
  };
  const handleValidation = (event) => {
    event.preventDefault();
    handleErrors(newPassword);
    setUnfocused(true);
    if (validatePassword(newPassword)) {
      setShowErrors(false);
      setPasswordValid(true);
    } else {
      setShowErrors(true);
      setPasswordValid(false);
    }
    setShowNewPassValidationMark(true);
  };
  const handleNewPasswordOnChange = (event) => {
    event.preventDefault();
    setNewPassword(event.target.value);
    handleErrors(event.target.value);
    event.target.value === confirmPassword ? setPasswordsMatch(true) : setPasswordsMatch(false);
    unfocused ? (validatePassword(event.target.value) ? setShowErrors(false) : setShowErrors(true)) : null;
  };

  const handleConfirmPassword = (event) => {
    event.preventDefault();
    const cPassword = event.target.value;
    setConfirmPassword(cPassword);
    if (newPassword.length === cPassword.length) {
      setShowConPassValidationMark(true);
      newPassword === cPassword ? setPasswordsMatch(true) : setPasswordsMatch(false);
    } else {
      setPasswordsMatch(false);
    }
  };
  const changePassword = async (event) => {
    event.preventDefault();
    if (newPassword === confirmPassword) {
      if (validatePassword(newPassword)) {
        const data = await fetch("/user/account/change-password", {
          method: "POST",
          body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
        });
        const response = await data.json();
        if (response.status === 200) {
          toast.success(response.message);
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
        } else {
          toast.error(response.message);
        }
      } else {
        toast.error("Invalid Password");
      }
    } else {
      toast.error("New passwords do not match");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-2">
      <h1 className="text-2xl font-bold pb-5 whitespace-nowrap">Customer Information</h1>
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
      <form>
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
          <div className="flex flex-row items-center ">
            <input
              type="password"
              className={`border-[1px] border-black ${
                showNewPassValidationMark ? (passwordValid ? "border-green-700 !border-2" : "border-red-600 !border-2") : null
              } `}
              value={newPassword}
              onChange={(event) => handleNewPasswordOnChange(event)}
              onBlur={(event) => handleValidation(event)}
            />
            <div>
              {showNewPassValidationMark ? (
                passwordValid ? (
                  <AiOutlineCheckCircle size={28} color="green" />
                ) : (
                  <AiOutlineCloseCircle size={28} color="red" />
                )
              ) : null}
            </div>
          </div>
          {showErrors ? (
            <ul className="list-disc list-inside text-xs text-left ml-5">
              <li className={`${formErrors.uppercaseError.status ? "text-green-700" : "text-red-600"}`}>
                {formErrors.uppercaseError.error}
              </li>
              <li className={`${formErrors.lowercaseError.status ? "text-green-700" : "text-red-600"}`}>
                {formErrors.lowercaseError.error}
              </li>
              <li className={`${formErrors.numberError.status ? "text-green-700" : "text-red-600"}`}>{formErrors.numberError.error}</li>
              <li className={`${formErrors.specialCharError.status ? "text-green-700" : "text-red-600"}`}>
                {formErrors.specialCharError.error}
              </li>
              <li className={`${formErrors.lengthError.status ? "text-green-700" : "text-red-600"}`}>{formErrors.lengthError.error}</li>
            </ul>
          ) : null}
        </div>
        <div className="flex flex-col w-1/2 pb-2">
          <label className="whitespace-nowrap">Re-type New Password</label>
          <div className="flex flex-row items-center">
            <input
              type="password"
              className={`border-[1px] border-black ${
                showConPassValidationMark ? (passwordsMatch ? "border-green-700 !border-2" : "border-red-600 !border-2") : null
              }`}
              value={confirmPassword}
              onChange={(event) => handleConfirmPassword(event)}
            />
            <div>
              {showConPassValidationMark ? (
                passwordsMatch ? (
                  <AiOutlineCheckCircle size={28} color="green" />
                ) : (
                  <div className="flex flex-row items-center">
                    <AiOutlineCloseCircle size={28} color="red" />{" "}
                    <span className="text-[10px] whitespace-nowrap text-red-600">Passwords do not match.</span>
                  </div>
                )
              ) : null}
            </div>
          </div>
        </div>
        <button className="bg-blue-800 text-white rounded-full p-2" onClick={(event) => changePassword(event)}>
          Change Password
        </button>
      </form>
    </div>
  );
}

export function AccountHistory({
  setOrder,
}: {
  setOrder: React.Dispatch<
    React.SetStateAction<
      Order & {
        cart: Cart & {
          cartItems: CartItem[];
        };
        shipping: ShippingAddress;
        image: Img;
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
    <div className="flex flex-col w-full md:w-1/3 h-full my-8 bg-white rounded-xl shadow-lg p-2">
      <div className="flex flex-row justify-between items-center pb-5">
        <h1 className="text-2xl md:text-4xl font-bold">Order List</h1>
        <select className="border-2 border-black rounded-md" defaultValue="10" onChange={(event) => changeLimit(event)}>
          <option value="10" defaultValue="10">
            10
          </option>
          <option value="25">25</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
      </div>
      <div className="w-full border-2 border-black text-center  rounded-xl">
        <div className="grid grid-cols-5 w-full bg-black text-white h-12 text-sm font-semibold items-center rounded-t-lg ">
          <div className="md:px-1">Order #</div>
          <div className="md:px-1">Date</div>
          <div className="md:px-1">Total</div>
          <div className="md:px-1">Order Status</div>
          <div className="md:px-1">Shipping</div>
        </div>
        <div className="h-[400px] overflow-y-scroll bg-white">
          {!isLoading ? (
            data.userOrders &&
            data.userOrders.map(
              (
                order: Order & {
                  cart: Cart & {
                    cartItems: CartItem[];
                  };
                  shipping: ShippingAddress;
                  image: Img;
                }
              ) => {
                const date = new Date(order.date);
                return (
                  <div
                    className="grid grid-cols-5 text-sm  cursor-pointer h-10 items-center even:bg-slate-200 "
                    key={order.id}
                    onClick={() => setOrder(order)}
                  >
                    <div className="py-2">{order.id}</div>
                    <div className="py-2">{`${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`}</div>
                    <div className="py-2">${order.amount}</div>
                    <div className="py-2">{order.approved ? "Approved" : "Pending"}</div>
                    <div className="py-2">{order.trackingNumber ? "Shipped" : "Pending"}</div>
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
        <div className="grid grid-cols-3 border-t-[1px] items-center  border-black h-10 rounded-b-xl bg-white">
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
  setOrder,
}: {
  order: Order & {
    cart: Cart & {
      cartItems: CartItem[];
    };
    shipping: ShippingAddress;
    image: Img;
  };
  setOrder: React.Dispatch<
    React.SetStateAction<
      Order & {
        cart: Cart & {
          cartItems: CartItem[];
        };
        shipping: ShippingAddress;
        image: Img;
      }
    >
  >;
}) {
  return (
    <div
      className="flex fixed bg-opacity-50 top-0 left-0 right-0 bg-black w-full md:h-full md:inset-0 h-screen z-50 "
      onClick={() => setOrder(null)}
    >
      <div className="relative w-2/3 h-min p-2 rounded-lg md:h-auto m-auto bg-white overflow-y-scroll" onClick={(e) => e.stopPropagation()}>
        <h1 className="text-4xl font-bold pb-2">Order Details</h1>
        {order ? (
          <div>
            <div className="flex flex-row justify-between">
              <div className="flex flex-col">
                <h2 className="font-semibold">Full Name</h2>
                <p className="text-sm">
                  {order.shipping.firstName} {order.shipping.lastName}
                </p>
              </div>
              <div className="flex flex-col">
                <h2 className="font-semibold">Order Status</h2>
                <p className="text-sm">{order.approved ? "Approved" : "Pending"}</p>
              </div>
            </div>
            <div className="flex flex-col">
              <label className="text-lg font-semibold">Address</label>
              <p className="text-sm">
                {order.shipping.streetAddress} {order.shipping.streetAddress2} {order.shipping.city}, {order.shipping.state}{" "}
                {order.shipping.zipCode}
              </p>
            </div>
            <div className="flex flex-row justify-between">
              <div>
                <h2 className="font-semibold">Order Date</h2>
                <p className="text-sm">{new Date(order.date).toLocaleDateString()}</p>
              </div>
              <div>
                <h2 className="font-semibold">Tracking Number</h2>
                <p className="text-sm">{order.trackingNumber ? order.trackingNumber : "N/A"}</p>
              </div>
            </div>
            <div>
              <h2 className="font-semibold text-lg text-center py-2">Product List</h2>
              <div className="flex flex-col text-center border-black border-2 rounded-lg">
                <div className="grid grid-cols-4 bg-black text-white font-semibold h-12 items-center">
                  <div className="md:px-1">Name</div>
                  <div className="md:px-1">Quantity</div>
                  <div className="md:px-1">Price per</div>
                  <div className="md:px-1">Total</div>
                </div>
                {order.cart.cartItems.map((orderProduct) => {
                  return (
                    <div key={orderProduct.productId} className="grid grid-cols-4 text-sm h-10">
                      <div className="py-2">{orderProduct.productName}</div>
                      <div className="py-2">{orderProduct.quantity}</div>
                      <div className="py-2">${orderProduct.price}</div>
                      <div className="py-2">${orderProduct.price * orderProduct.quantity}</div>
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
    </div>
  );
}
// console.log(window.matchMedia("(min-width: 768px)").matches);
