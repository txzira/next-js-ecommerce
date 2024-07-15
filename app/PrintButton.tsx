"use client";
import React from "react";
import { AiFillPrinter } from "react-icons/ai";

const PrintButton = ({ className }: { className: string }) => {
  const print = () => {
    window.print();
  };
  return (
    <button type="button" className={className} onClick={() => print()}>
      <AiFillPrinter />
      <span> Print </span>
    </button>
  );
};

export default PrintButton;
