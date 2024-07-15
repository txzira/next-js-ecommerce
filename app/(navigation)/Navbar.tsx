"use client";
import React, { Suspense, useState } from "react";
import Link from "next/link";
import CartModal from "./CartModal";
import { useSession, signOut } from "next-auth/react";
import { AiOutlineShoppingCart } from "react-icons/ai";
import NavLink from "./NavLink";
import { useCartState } from "app/CartProvider";

import { IoMenu } from "react-icons/io5";
import NavModal from "./NavModal";
import Image from "next/image";
export default function Navbar({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [showCart, setShowCart] = useState(false);
  const [showNav, setShowNav] = useState(false);
  const [logo, setLogo] = useState("/images/pseudo-corp-white.png");

  // const { data, error, isLoading, mutate } = useSWR("/get-cart", fetcher);
  const { cartItems, getCartTotal, getTotalItems } = useCartState();

  const changeImage = () => {
    logo === "/images/pseudo-corp-white.png"
      ? setLogo("/images/pseudo-corp-white.gif")
      : setLogo("/images/pseudo-corp-white.png");
  };

  return (
    <>
      {showCart && (
        <CartModal
          cart={cartItems}
          cartTotal={getCartTotal()}
          setShow={setShowCart}
        />
      )}
      {showNav && <NavModal setShow={setShowNav}>{children}</NavModal>}
      <nav>
        <ul className="flex h-14 flex-row  bg-red-600 text-sm font-semibold text-white shadow-md md:text-lg">
          <li className="mx-2 flex items-center sm:hidden">
            <button onClick={() => setShowNav(true)}>
              <IoMenu size={40} color="white" />
            </button>
          </li>
          <li
            className="relative h-14 w-48 sm:mx-2"
            onMouseLeave={() => changeImage()}
            onMouseEnter={() => changeImage()}>
            <Link href="/products" className="absolute h-full w-full  ">
              <Image src={logo} alt="logo" fill className="object-contain" />
            </Link>
          </li>
          <li className="hidden sm:block">
            <NavLink href="/products">Products</NavLink>
          </li>
          <ul className="hidden sm:flex">{children}</ul>
          {/* {status === "authenticated" && session.user.role === "ADMIN" ? <NavLink href="/admin">Admin</NavLink> : null} */}
          <li className="ml-auto hidden flex-row sm:flex">
            {status === "authenticated" ? (
              <>
                <NavLink href="/account">Account</NavLink>
                <button
                  className="flex h-full items-center px-2 hover:bg-white hover:text-black md:px-4"
                  onClick={() => signOut()}>
                  Logout
                </button>
              </>
            ) : (
              <NavLink href="/auth/login">Login</NavLink>
            )}
          </li>
          <li className="ml-auto mr-2 sm:m-0">
            <button
              className="group relative flex h-full items-center px-2  hover:bg-white md:px-4"
              onClick={() => setShowCart(!showCart)}>
              <AiOutlineShoppingCart
                size={28}
                color={`${showCart ? "black" : "white"}`}
                className="group-hover:fill-black"
              />
              {getTotalItems() !== 0 && (
                <span className="absolute right-0 top-[10%] flex min-h-5 min-w-5 items-center justify-center  rounded-full bg-black text-sm leading-none text-white sm:right-[5%] ">
                  {getTotalItems()}
                </span>
              )}
            </button>
          </li>
        </ul>
      </nav>
    </>
  );
}
