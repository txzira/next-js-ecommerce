import React from "react";

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full">
      <div className="mx-auto mt-10 md:w-5/6">{children}</div>
    </div>
  );
}
