"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import useSWR from "swr";
import CartModal from "./Cart";
import { useSelectedLayoutSegments } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { Cart, CartItem } from "@prisma/client";

function NavLink({
  children,
  href,
}: {
  children: React.ReactNode;
  href: string;
}) {
  let segment: any = useSelectedLayoutSegments();
  let active = false;
  if (href === "/admin" && `/${segment[1]}` === href) active = true;
  else if (href === "/" && segment.length === 0) active = true;
  else if (
    segment[2] !== undefined &&
    href.split("/")[2] !== undefined &&
    segment[1] !== "admin"
  )
    active = segment[1] === href.split("/")[1];
  return (
    <Link
      href={href}
      className={`
      flex h-full items-center px-1 hover:bg-white hover:text-black md:px-4
       ${active ? "bg-white text-black" : null}
       `}>
      {children}
    </Link>
  );
}

export default function Navbar() {
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
      <nav className="flex h-14 flex-row  bg-black text-sm font-semibold text-white md:text-lg">
        <NavLink href="/products">Products</NavLink>
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
      </nav>
    </>
  );
}
