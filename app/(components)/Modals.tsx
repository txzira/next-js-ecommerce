import React, { ComponentProps } from "react";

const ModalRightSide: React.FC<
  ComponentProps<"div"> & {
    children: React.ReactNode;
  }
> = ({ children, ...props }) => {
  return (
    <div
      className="fixed left-0 right-0 top-0 z-10 flex h-full w-full   bg-black bg-opacity-50 md:inset-0 "
      onClick={props.onClick}
    >
      <div
        className="relative ml-auto h-full w-[90%] rounded-l-lg bg-white p-2 md:h-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

export { ModalRightSide };
