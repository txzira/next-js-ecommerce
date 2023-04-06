"use client";
import Link from "next/link";
import { useSelectedLayoutSegments, useSelectedLayoutSegment } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";

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
      flex items-center h-full px-1 md:px-4 hover:bg-white hover:text-black
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
    <nav className="flex flex-row justify-center text-sm md:text-lg font-semibold bg-black text-white h-14">
      {/* <NavLink href="/">Home</NavLink> */}
      <div className="absolute left-0 ml-2 md:ml-4 h-14 w-14 md:w-20">
        {status === "authenticated" ? (
          <Link href="/user/products" className="h-14 w-14 md:w-20">
            <Image src="/images/logo.png" fill={true} alt="logo" />
          </Link>
        ) : (
          <Link href="/" className="h-14 w-20  ">
            <Image src="/images/logo.png" fill={true} alt="logo" />
          </Link>
        )}
      </div>
      {status === "authenticated" && session.user.role === "admin" ? <NavLink href="/admin">Admin</NavLink> : null}
      {status === "authenticated" ? <NavLink href="/user/products">Products</NavLink> : null}
      {status === "authenticated" ? <NavLink href="/user/account">Account</NavLink> : null}
      {status === "authenticated" ? (
        <button className="flex items-center  h-full px-2 md:px-4 hover:bg-white hover:text-black" onClick={() => signOut()}>
          Logout
        </button>
      ) : null}
      {/* {status === "unauthenticated" ? <NavLink href="/auth/login">Login</NavLink> : null} */}
    </nav>
  );
}
