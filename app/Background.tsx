"use client";
import React, { useCallback, useEffect, useState } from "react";

const useMediaQuery = (width: number) => {
  const [targetReached, setTargetReached] = useState(false);

  const updateTarget = useCallback((e: any) => {
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

export default function Background() {
  const isBreakpoint = useMediaQuery(768);
  return (
    <>
      {isBreakpoint ? (
        <div
          className=" absolute h-[calc(100vh_-_3.5rem)] w-full bg-opacity-20 bg-repeat opacity-20"
          style={{
            backgroundImage: `url(${"/images/logo-bg.png"})`,
            backgroundSize: "130px 130px",
            backgroundColor: "",
          }}></div>
      ) : (
        <div
          className=" absolute z-0 h-[calc(100vh_-_3.5rem)] w-full bg-repeat opacity-20 "
          style={{
            backgroundImage: `url(${"/images/logo-bg.png"})`,
            backgroundSize: "200px 200px",
          }}></div>
      )}
    </>
  );
}
