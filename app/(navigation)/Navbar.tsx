"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import useSWR from "swr";
import CartModal from "./Cart";
import { useSelectedLayoutSegments } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { Cart, CartItem } from "@prisma/client";
import NavLink from "./NavLink";
import CategoryNavLinks from "./CategoryNavLinks";

export default function Navbar({ children }: { children: React.ReactNode }) {
  const fetcher = (url) => fetch(url).then((res) => res.json());
  const { data: session, status } = useSession();
  const [showCart, setShowCart] = useState(false);
  const { data, error, isLoading, mutate } = useSWR("/get-cart", fetcher);
  const [cart, setCart] = useState<
    Cart & {
      cartItems: CartItem[];
    }
  >(null);
  useEffect(() => {
    if (data) {
      setCart(data.cart);
    }
  }, [data]);

  return (
    <>
      {showCart ? (
        <CartModal cart={cart} setShow={setShowCart} mutate={mutate} />
      ) : null}
      <nav>
        <ul className="flex h-14 flex-row  bg-black text-sm font-semibold text-white md:text-lg">
          <NavLink href="/products">Products</NavLink>
          {children}
          {/* {status === "authenticated" && session.user.role === "ADMIN" ? <NavLink href="/admin">Admin</NavLink> : null} */}
          {status === "authenticated" ? (
            <>
              <NavLink href="/user/account">Account</NavLink>
              <button
                className="flex h-full items-center px-2 hover:bg-white hover:text-black md:px-4"
                onClick={() => signOut()}>
                Logout
              </button>
              <button
                className="flex h-full items-center px-2 hover:bg-white hover:text-black md:px-4"
                onClick={() => setShowCart(!showCart)}>
                <AiOutlineShoppingCart size={20} />
              </button>
            </>
          ) : null}
        </ul>
      </nav>
    </>
  );
}
