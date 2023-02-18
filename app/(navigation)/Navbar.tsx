"use client";
import Link from "next/link";
import { useSelectedLayoutSegments } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

export function NavLink({ children, href }) {
  return (
    <Link href={href} className="px-4">
      {children}
    </Link>
  );
}

export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <nav className="flex flex-row justify-evenly">
      <NavLink href="/">Home</NavLink>
      {status === "authenticated" && session.user.role === "admin" ? <NavLink href="/admin">Admin</NavLink> : null}
      {status === "authenticated" ? <NavLink href="/user/products">Products</NavLink> : null}
      <div>
        {status === "authenticated" ? <NavLink href="/user/account">Account</NavLink> : null}
        {status === "authenticated" ? <button onClick={() => signOut()}>sign out</button> : null}
        {status === "unauthenticated" ? <NavLink href="/auth/login">Login</NavLink> : null}
      </div>
    </nav>
  );
}
