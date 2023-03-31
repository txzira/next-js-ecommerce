import React from "react";

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full">
      <div className="w-5/6 mx-auto mt-10">{children}</div>
    </div>
  );
}
