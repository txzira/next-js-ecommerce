"use client";
import Link from "next/link";
import { useSelectedLayoutSegments } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

export function NavLink({ children, href }) {
  return (
    <Link href={href} className="flex items-center h-full px-4 hover:bg-white hover:text-black">
      {children}
    </Link>
  );
}

export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <nav className="flex flex-row justify-center bg-black text-white h-10">
      <NavLink href="/">Home</NavLink>
      {status === "authenticated" && session.user.role === "admin" ? <NavLink href="/admin">Admin</NavLink> : null}
      {status === "authenticated" ? <NavLink href="/user/products">Products</NavLink> : null}

      {status === "authenticated" ? <NavLink href="/user/account">Account</NavLink> : null}
      {status === "authenticated" ? (
        <button className="h-full px-4 hover:bg-white hover:text-black" onClick={() => signOut()}>
          sign out
        </button>
      ) : null}
      {status === "unauthenticated" ? <NavLink href="/auth/login">Login</NavLink> : null}
    </nav>
  );
}
