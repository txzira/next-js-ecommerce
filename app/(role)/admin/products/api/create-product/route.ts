import { NextRequest, NextResponse } from "next/server";
import { uploadImage } from "lib/cloudinary";
import prisma from "lib/prisma";
import { Category, Product } from "@prisma/client";

export async function POST(request: NextRequest) {
  try {
    if (request.method === "POST") {
      const {
        product,
        selectedCategories,
        defaultImage,
      }: {
        product: Product;
        selectedCategories: Map<string, Category>;
        defaultImage: {
          imageName: string;
          imagePath: string;
          oldImagePubId: string;
        };
      } = await request.json();

      let categories = [];
      let defaultImageCloudinary:
        | {
            public_id: string;
            url: string;
            asset_id: any;
          }
        | undefined;
      for (const key of Object.keys(selectedCategories)) {
        categories.push({ id: selectedCategories.get(key)!.id });
      }
      if (Object.keys(defaultImage).length !== 0) {
        defaultImageCloudinary = await uploadImage(
          defaultImage.imagePath,
          `default${defaultImage.imageName}`
        );
      }
      const addedProduct = await prisma!.product.create({
        data: {
          name: product.name,
          sku: product.sku,
          quantity: Number(product.quantity),
          description: product.description,
          slug: product.slug,
          ...(defaultImageCloudinary &&
            Object.keys(defaultImageCloudinary).length && {
              image: {
                create: {
                  publicId: defaultImageCloudinary.public_id,
                  url: defaultImageCloudinary.url,
                },
              },
            }),
          price: Number(product.price),
          categories: { connect: categories },
        },
      });

      return NextResponse.json(
        {
          message: `Added product '${addedProduct.name}' successfully!`,
          id: addedProduct.id,
        },
        { status: 201 }
      );
    } else {
      return NextResponse.json("Route not valid.", { status: 500 });
    }
  } catch (error: any) {
    console.log(error);
    if (error.code === "P2002") {
      return NextResponse.json(" Product already exist", { status: 400 });
    }
  }
}
