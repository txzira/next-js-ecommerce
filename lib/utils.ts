import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function absoluteUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_APP_URL}${path}`;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const USDollar = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export const capitalizeFirstLetter = (word: string) => {
  return word[0].toUpperCase() + word.substring(1);
};
