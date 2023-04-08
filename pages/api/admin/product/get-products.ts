import prisma from "lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

// export default async (req: NextApiRequest, res: NextApiResponse) => {
//   if (req.method === "GET") {
//     const { limit, page, cursorId, sortId }: any = req.query;
//     const products = await prisma.product.findMany({
//       take: Number(limit),
//       ...(Number(page) === 0 && { skip: 0 }),
//       ...(Number(page) !== 0 && { skip: 1 }),
//       ...(Number(cursorId) && { cursor: { id: Number(cursorId) } }),
//       orderBy: { id: sortId },
//     });
//     res.status(200).json({ products });
//   } else {
//     res.status(500).json({ message: "Route not valid" });
//   }
// };

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const products = await prisma.product.findMany({ include: { type: true } });
    res.status(200).json({ products });
  } else {
    res.status(500).json({ message: "Route not valid" });
  }
};
