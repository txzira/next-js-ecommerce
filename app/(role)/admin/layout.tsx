"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import React from "react";

function NavLink({ children, href }: { children: React.ReactNode; href: string }) {
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
      flex items-center h-14 px-4 rounded-lg hover:bg-white hover:text-black
       ${active ? "bg-white text-black" : null}
       `}
    >
      {children}
    </Link>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  return session?.user.role === "admin" ? (
    <div className="flex flex-row h-full">
      <nav className="flex flex-col gap-2 p-2 border-r-2 w-44 border-black bg-green-600 text-white shadow-[10px_0_10px_0_rgb(0,0,0,0.15)]">
        <NavLink href="/admin">Admin</NavLink>
        <NavLink href="/admin/wallets">Wallets</NavLink>
        <NavLink href="/admin/categories">Categories</NavLink>
        <NavLink href="/admin/products">Products</NavLink>
        <NavLink href="/admin/customers">Customers</NavLink>
        <NavLink href="/admin/orders">Orders</NavLink>
      </nav>
      <div className="w-full p-10 overflow-y-scroll">{children}</div>
    </div>
  ) : (
    <div>Unauthorized User</div>
  );
}
