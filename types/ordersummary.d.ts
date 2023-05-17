import { Order, ShippingAddress } from "@prisma/client";

export declare type OrderSummary = Order & {
  customer: {
    firstName: string;
    lastName: string;
    email: string;
  };
  cart: Cart & {
    cartItems: CartItem[];
  };
  shipping: ShippingAddress;
  image: {
    url: string;
  };
};
