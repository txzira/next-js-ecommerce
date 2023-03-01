"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import React from "react";

function NavLink({ children, href }: { children: React.ReactNode; href: string }) {
  let segment: any = useSelectedLayoutSegment();
  let active = href.includes(segment);
  return (
    <Link
      href={href}
      className={`
      flex items-center h-full px-4 hover:bg-white hover:text-black
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
