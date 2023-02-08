"use client";
import { NavLink } from "app/(navigation)/Navbar";
import { useSession } from "next-auth/react";
import React from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();

  return session?.user.role === "admin" ? (
    <div className="flex flex-row">
      <nav className="flex flex-col">
        <NavLink href="/admin/customers">Customers</NavLink>
        <NavLink href="/admin/orders">Orders</NavLink>
        <NavLink href="/admin/products">Products</NavLink>
      </nav>
      {children}
    </div>
  ) : (
    <>Unauthorized User</>
  );
}
