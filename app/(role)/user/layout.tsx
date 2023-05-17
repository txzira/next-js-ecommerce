import React from "react";

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full w-full">
      <div className="mx-auto w-[90%] overflow-scroll md:w-5/6">{children}</div>
    </div>
  );
}
