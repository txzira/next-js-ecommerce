import prisma from "lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    try {
      const { cart } = req.body;
      console.log({ cart });
      const order = await prisma.orders.create({ data: { customerId } });
      // res.status(200).json({ message: `Added product '${product.name}' successfully!`, status: "ok" });
    } catch (error) {
      // if (error.code === "P2002") {
      //   res.status(400).json({ message: `Product already exist.`, status: "failed" });
      // }
    }
  } else {
    res.status(500).json({ message: "Route not valid" });
  }
};
