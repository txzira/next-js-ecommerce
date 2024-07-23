import Image from "next/image";
import React from "react";

const HeroImage = (props: any) => {
  return (
    <div className="group relative aspect-square h-full w-full bg-white">
      <Image
        src={props.src}
        fill
        alt="hero-image"
        className=" object-cover group-hover:opacity-50"
      />
      <div className="absolute flex h-full w-full items-center justify-center text-3xl font-medium  ">
        <p>{props.text}</p>
      </div>
    </div>
  );
};

export default HeroImage;
