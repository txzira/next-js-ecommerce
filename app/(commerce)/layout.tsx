import React from "react";
import CategoryNav from "./CategoryNav";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-row h-full w-full">
      <CategoryNav />
      <div className="mx-auto w-full  md:w-5/6">{children}</div>
    </div>
  );
}
