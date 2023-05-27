"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import React, { useState } from "react";
import { BsArrowLeftSquareFill, BsArrowRightSquareFill, BsFillArrowLeftSquareFill } from "react-icons/bs";

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
      flex items-center h-12 w-full px-1 rounded-lg hover:bg-white hover:text-black
       ${active ? "bg-white text-black" : null}
       `}
      onClick={() => setShowPanel(false)}
    >
      {children}
    </Link>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [showPanel, setShowPanel] = useState(false);
  const { data: session, status } = useSession();
  return session?.user.role === "ADMIN" ? (
    <div className="flex flex-row h-full">
      {showPanel ? (
        <nav className="flex flex-col grow-0 p-1 gap-1 border-r-2 w-max border-black bg-green-600 text-white shadow-[10px_0_10px_0_rgb(0,0,0,0.15)]">
          {showPanel ? (
            <button onClick={() => setShowPanel(false)} className="flex justify-center bg-black rounded-lg">
              <div className="bg-white rounded-lg ">
                <BsFillArrowLeftSquareFill size={40} color="black" />
              </div>
            </button>
          ) : null}
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

      <div className="overflow-y-scroll w-full">
        {!showPanel ? (
          <button onClick={() => setShowPanel(true)} className="flex flex-row items-center ml-1 mt-1 px-1 bg-green-600 rounded-lg">
            <span className="text-white">Admin Panel</span>
            <div className="bg-white rounded-lg">
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
