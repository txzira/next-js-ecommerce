"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import React, { useState } from "react";
import {
  BsArrowRightSquareFill,
  BsFillArrowLeftSquareFill,
} from "react-icons/bs";

function NavLink({
  children,
  href,
  setShowPanel,
}: {
  children: React.ReactNode;
  href: string;
  setShowPanel: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const segment: any = useSelectedLayoutSegment();
  let active;
  if (segment) {
    active = href.includes(segment);
  } else if (href === "/admin") {
    active = true;
  }
  return (
    <Link
      href={href}
      className={`
      flex h-12 w-full items-center rounded-lg px-1 hover:bg-white hover:text-black
       ${active ? "bg-white text-black" : null}
       `}
      onClick={() => setShowPanel(false)}
    >
      {children}
    </Link>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showPanel, setShowPanel] = useState(false);
  const { data: session, status } = useSession();
  return session?.user.role === "ADMIN" ? (
    <div className="flex h-full flex-row">
      {showPanel ? (
        <nav className="z-20 flex w-max grow-0 flex-col gap-1 border-r-2 border-black bg-green-600 p-1 text-white shadow-[10px_0_10px_0_rgb(0,0,0,0.15)]">
          <button
            onClick={() => setShowPanel(false)}
            className="flex justify-center rounded-lg bg-black"
          >
            <div className="rounded-lg bg-white ">
              <BsFillArrowLeftSquareFill size={40} color="black" />
            </div>
          </button>
          <NavLink href="/admin" setShowPanel={setShowPanel}>
            Admin
          </NavLink>
          <NavLink href="/admin/cryptowallets" setShowPanel={setShowPanel}>
            Wallets
          </NavLink>
          <NavLink href="/admin/categories" setShowPanel={setShowPanel}>
            Categories
          </NavLink>
          <NavLink href="/admin/products" setShowPanel={setShowPanel}>
            Products
          </NavLink>
          <NavLink href="/admin/customers" setShowPanel={setShowPanel}>
            Customers
          </NavLink>
          <NavLink href="/admin/orders" setShowPanel={setShowPanel}>
            Orders
          </NavLink>
        </nav>
      ) : null}

      <div className="w-full overflow-y-scroll font-[Lato,sans-serif]">
        {!showPanel ? (
          <button
            onClick={() => setShowPanel(true)}
            className="ml-1 mt-1 flex flex-row items-center rounded-lg bg-green-600 px-1"
          >
            <span className="text-white">Admin Panel</span>
            <div className="rounded-lg bg-white">
              <BsArrowRightSquareFill size={35} color="rgb(22 163 74)" />
            </div>
          </button>
        ) : null}
        {children}
      </div>
    </div>
  ) : (
    <div>Unauthorized User</div>
  );
}
//Lato,sans-serif;
