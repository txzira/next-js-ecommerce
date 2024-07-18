import { AttributeImage } from "@prisma/client";
import { destroyImage, uploadImage } from "lib/cloudinary";
import prisma from "lib/prisma";
import { USERTYPE } from "middleware";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "pages/api/auth/[...nextauth]";
import { TImageToSend } from "../../[id]/(components)/Variant";

export async function POST(request: NextRequest) {
  try {
    if (request.method === "POST") {
      const session = await getServerSession(authOptions);
      if (session?.user.role !== USERTYPE.ADMIN) {
        return NextResponse.json("Unauthorized Request", { status: 401 });
      }

      const {
        attributes,
        imagesToAddToDb,
        imagesToDeleteFromDb,
      }: {
        attributes: [
          number,
          {
            id: number;
            option: string;
            images: AttributeImage[];
            updated: boolean;
          }
        ][];
        imagesToAddToDb: [number, TImageToSend[]][];
        imagesToDeleteFromDb: [number, AttributeImage[]][];
      } = await request.json();

      //Add Attribute images to cloudinary and attach to attribute in database
      if (imagesToAddToDb.length) {
        imagesToAddToDb.map((imagesArr) => {
          imagesArr[1].map(async (image, index) => {
            const imageObj = await uploadImage(
              image.imagePath,
              image.imageName
            );

            await prisma!.attributeImage.create({
              data: {
                position: index + 1,
                attributeId: image.attributeId,
                url: imageObj!.url,
                publicId: imageObj!.public_id,
              },
            });
          });
        });
      }
      //Update attribute names that admin changed
      attributes.map(async (attribute) => {
        if (attribute[1].updated) {
          await prisma!.attribute.update({
            where: { id: attribute[1].id },
            data: {
              name: attribute[1].option,
            },
          });
        }
      });

      //Delete attribute images from cloudinary and remove from database
      if (imagesToDeleteFromDb.length) {
        imagesToDeleteFromDb.map((imageToDelete) => {
          imageToDelete[1].map(async (image) => {
            const deletedImage = await prisma!.attributeImage.delete({
              where: { id: image.id },
            });
            await destroyImage(deletedImage.publicId);
          });
        });
      }

      return NextResponse.json("Route valid", { status: 200 });
    } else {
      return NextResponse.json("Route not valid", { status: 500 });
    }
  } catch (error) {
    console.log(error);
  }
}
