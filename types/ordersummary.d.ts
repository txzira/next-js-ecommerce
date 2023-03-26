export declare type OrderSummary = Order & {
  products: {
    quantity: number;
    product: {
      name: string;
      price: number;
    };
  }[];
  customer: {
    email: string;
    firstName: string;
    lastName: string;
  };
  image: {
    url: string;
  };
};
