"use client";
import Link from "next/link";
import { useSelectedLayoutSegments, useSelectedLayoutSegment } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

function NavLink({ children, href }: { children: React.ReactNode; href: string }) {
  let segment: any = useSelectedLayoutSegments();
  let active = false;
  if (href === "/admin" && `/${segment[1]}` === href) active = true;
  else if (href === "/" && segment.length === 0) active = true;
  else if (segment[2] !== undefined && href.split("/")[2] !== undefined && segment[1] !== "admin")
    active = segment[2] === href.split("/")[2];
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

export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <nav className="flex flex-row justify-center bg-black text-white h-14">
      <NavLink href="/">Home</NavLink>
      {status === "authenticated" && session.user.role === "admin" ? <NavLink href="/admin">Admin</NavLink> : null}
      {status === "authenticated" ? <NavLink href="/user/products">Products</NavLink> : null}

      {status === "authenticated" ? <NavLink href="/user/account">Account</NavLink> : null}
      {status === "authenticated" ? (
        <button className="h-full px-4 hover:bg-white hover:text-black" onClick={() => signOut()}>
          Sign Out
        </button>
      ) : null}
      {status === "unauthenticated" ? <NavLink href="/auth/login">Login</NavLink> : null}
    </nav>
  );
}
