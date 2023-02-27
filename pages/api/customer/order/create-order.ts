import { connect } from "http2";
import { uploadImage } from "lib/cloudinary";
import prisma from "lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

async function getOrderTotal(cart) {
  let total = 0;
  await cart.map((product) => {
    total += Number(product.price) * Number(product.quantity);
  });
  return total;
}
async function getOrderProducts(cart) {
  const orderProducts = await cart.map((product) => {
    return { productId: Number(product.id), quantity: Number(product.quantity) };
  });
  return orderProducts;
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const { cart, customerId, imagePath, imageName } = req.body;
    try {
      const orderProducts = await getOrderProducts(cart);
      const total = await getOrderTotal(cart);
      const imageObj = await uploadImage(imagePath, imageName);

      await prisma.order.create({
        data: {
          customer: { connect: { id: Number(customerId) } },
          products: { createMany: { data: orderProducts } },
          amount: total,
          image: { create: { assetId: imageObj.asset_id, publicId: imageObj.public_id, url: imageObj.url } },
        },
      });
      res.status(200).json({ message: `Order created successfully!`, status: "ok" });
    } catch (error) {
      if (error.code === "P2002") {
        res.status(400).json({ message: `Order failed. Image name "${imageName}" already in use, please rename image.`, status: "failed" });
      }
    }
  } else {
    res.status(500).json({ message: "Route not valid" });
  }
};
