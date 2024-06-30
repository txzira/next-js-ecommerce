import { Category, Product } from "@prisma/client";
import { destroyImage, uploadImage } from "lib/cloudinary";
import prisma from "lib/prisma";
import { USERTYPE } from "middleware";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "pages/api/auth/[...nextauth]";

export async function POST(request: NextRequest) {
  if (request.method === "POST") {
    // const session = await getServerSession(authOptions);
    // if (session.user.role !== USERTYPE.ADMIN) {
    //   return NextResponse.json("Unauthorized Request", { status: 401 });
    // }
    // const {
    //   product,
    //   defaultImage,
    //   selectedCategories,
    // }: {
    //   product: Product;
    //   defaultImage: {
    //     imageName: string;
    //     imagePath: any;
    //     oldImagePubId: string;
    //   };
    //   selectedCategories: Map<string, Category>;
    // } = await request.json();
    // let updatedProduct: Product;
    // let categories = [];
    // if (!selectedCategories.size) {
    //   for (const key of Object.keys(selectedCategories)) {
    //     categories.push({ id: selectedCategories[key].id });
    //   }
    // }
    // if (Object.keys(defaultImage).length !== 0) {
    //   if (defaultImage.oldImagePubId) {
    //     await destroyImage(defaultImage.oldImagePubId);
    //   }
    //   const defaultImageCloudinary = await uploadImage(
    //     defaultImage.imagePath,
    //     `default${defaultImage.imageName}`
    //   );
    //   updatedProduct = await prisma.product.update({
    //     where: { id: product.id },
    //     data: {
    //       name: product.name,
    //       sku: product.sku,
    //       quantity: Number(product.quantity),
    //       description: product.description,
    //       slug: product.slug,
    //       images: {
    //         upsert: {
    //           create: {
    //             publicId: defaultImageCloudinary.public_id,
    //             url: defaultImageCloudinary.url,
    //           },
    //           update: {
    //             publicId: defaultImageCloudinary.public_id,
    //             url: defaultImageCloudinary.url,
    //           },
    //         },
    //       },
    //       price: Number(product.price),
    //       ...(selectedCategories.size
    //         ? { categories: { connect: categories } }
    //         : { categories: { set: [] } }),
    //       active: product.active,
    //     },
    //   });
    // } else {
    //   updatedProduct = await prisma.product.update({
    //     where: { id: product.id },
    //     data: {
    //       name: product.name,
    //       sku: product.sku,
    //       quantity: Number(product.quantity),
    //       description: product.description,
    //       slug: product.slug,
    //       price: Number(product.price),
    //       ...(selectedCategories.size
    //         ? { categories: { connect: categories } }
    //         : { categories: { set: [] } }),
    //       active: product.active,
    //     },
    //   });
    // }

    return NextResponse.json(`Product updated successfully`, {
      status: 200,
    });
  } else {
    return NextResponse.json("Route no valid", { status: 500 });
  }
}
