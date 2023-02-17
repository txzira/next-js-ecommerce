import { NextApiRequest, NextApiResponse } from "next";
import { uploadImage } from "lib/cloudinary";
import prisma from "lib/prisma";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const { name, price } = req.body;
    try {
      const product = await prisma.product.create({
        data: { name: name, price: Number(price) },
      });
      res.status(200).json({ message: `Added product '${product.name}' successfully!`, status: "ok" });
    } catch (error) {
      if (error.code === "P2002") {
        res.status(400).json({ message: `Product already exist.`, status: "failed" });
      }
    }
  } else {
    res.status(500).json({ message: "Route not valid" });
  }
};
