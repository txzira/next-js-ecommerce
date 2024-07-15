"use client";
import Link from "next/link";
import { useSelectedLayoutSegments } from "next/navigation";
import React from "react";

const NavLink = ({
  children,
  href,
}: {
  children: React.ReactNode;
  href: string;
}) => {
  let segment: any = useSelectedLayoutSegments();
  let active = false;
  if (`/${segment[1]}` === href) active = true;
  else if (segment[1] === "categories" && href.split("/")[2] === segment[2])
    active = true;
  return (
    <Link
      href={href}
      className={`
        flex h-14 items-center px-1 hover:bg-white hover:text-black sm:h-full md:px-4
        ${active ? "bg-white text-black" : null}
        `}>
      {children}
    </Link>
  );
};

export default NavLink;
