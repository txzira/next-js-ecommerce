import React from "react";
import CategoryNavLinks from "../(navigation)/CategoryNavLinks";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full w-full flex-row">
      <div className="mx-auto w-full  md:w-5/6">{children}</div>
    </div>
  );
}
