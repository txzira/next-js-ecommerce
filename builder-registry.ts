"use client";
import { builder, Builder } from "@builder.io/react";
import Counter from "./components/Counter/Counter";
import HeroImage from "app/HeroImage";

builder.init(process.env.NEXT_PUBLIC_BUILDER_API_KEY!);

Builder.registerComponent(Counter, {
  name: "Counter",
  inputs: [
    {
      name: "initialCount",
      type: "number",
    },
  ],
});
Builder.registerComponent(HeroImage, {
  name: "Hero Image",
  inputs: [
    { name: "text", type: "text" },
    { name: "src", type: "file" },
  ],
});
