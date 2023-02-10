import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  secure: true,
});

export async function uploadImage(imagePath, imageName) {
  const options = {
    public_id: imageName,
    folder: "prisma-store",
    unique_filename: false,
    overwrite: true,
  };

  try {
    const result = await cloudinary.uploader.upload(imagePath, options);
    return { public_id: result.public_id, url: result.url, asset_id: result.asset_id };
  } catch (error) {
    console.error(error);
  }
}
