"use client";
import React, { useCallback, useEffect, useState } from "react";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import Header from "./(navigation)/Header";
import Image from "next/image";

const useMediaQuery = (width) => {
  const [targetReached, setTargetReached] = useState(false);

  const updateTarget = useCallback((e) => {
    if (e.matches) {
      setTargetReached(true);
    } else {
      setTargetReached(false);
    }
  }, []);

  useEffect(() => {
    const media = window.matchMedia(`(max-width: ${width}px)`);
    media.addEventListener("change", updateTarget);

    // Check on mount (callback is not called until a change occurs)
    if (media.matches) {
      setTargetReached(true);
    }

    return () => media.removeEventListener("change", updateTarget);
  }, [width, updateTarget]);

  return targetReached;
};

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  const isBreakpoint = useMediaQuery(768);
  return (
    <>
      <SessionProvider>
        <Toaster />
        <Header />

        {isBreakpoint ? (
          <div
            className=" absolute h-[calc(100vh_-_3.5rem)] w-full bg-repeat opacity-20 bg-opacity-20"
            style={{ backgroundImage: `url(${"/images/logo-bg.png"})`, backgroundSize: "130px 130px", backgroundColor: "" }}
          ></div>
        ) : (
          <div
            className=" absolute h-[calc(100vh_-_3.5rem)] w-full bg-repeat opacity-20 z-0 "
            style={{ backgroundImage: `url(${"/images/logo-bg.png"})`, backgroundSize: "200px 200px" }}
          ></div>
        )}
        <main className="relative h-[calc(100vh_-_3.5rem)] md:h-[calc(100vh_-_3.5rem)] ">{children}</main>
      </SessionProvider>
    </>
  );
}
