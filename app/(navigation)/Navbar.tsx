"use client";
import Link from "next/link";
import { useSelectedLayoutSegments } from "next/navigation";
import { useSession } from "next-auth/react";

export function NavLink({ children, href }) {
  return (
    <Link href={href} className="">
      {children}
    </Link>
  );
}

export default function Navbar() {
  const { data: session, status } = useSession();

  // console.log(session);
  return (
    <nav className="flex flex-row justify-evenly">
      <NavLink href="/">Home</NavLink>
      {status === "authenticated" ? <NavLink href="/account">Account</NavLink> : null}
      {status === "unauthenticated" ? <NavLink href="/login">Login</NavLink> : null}
    </nav>
  );
}
