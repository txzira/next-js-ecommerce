import React from "react";
import CategoryNavLinks from "../(navigation)/CategoryNavLinks";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="h-max w-full overflow-clip">{children}</div>;
}
