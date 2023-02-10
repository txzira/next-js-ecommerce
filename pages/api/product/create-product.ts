import { NextApiRequest, NextApiResponse } from "next";
import { uploadImage } from "lib/cloudinary";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { imagePath, imageName } = req.body;
  const imageObj = await uploadImage(imagePath, imageName);
  console.log(imageObj);

  res.status(200).json({ name: "John Doe" });
};
