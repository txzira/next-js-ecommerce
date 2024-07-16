import { Attribute } from "@prisma/client";
import prisma from "lib/prisma";
import { USERTYPE } from "middleware";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "pages/api/auth/[...nextauth]";

export async function POST(request: NextRequest) {
  try {
    if (request.method === "POST") {
      // const session = await getServerSession(authOptions);
      // if (session.user.role !== USERTYPE.ADMIN) {
      //   return NextResponse.json("Unauthorized Request", { status: 401 });
      // }

      // const { id } = await request.json();
      // const product = await prisma.product.findUnique({
      //   where: { id: Number(id) },
      //   include: {
      //     attributeGroup: {
      //       include: { attributes: { include: { images: true } } },
      //     },
      //   },
      // });
      // const attributeGroups = product.attributeGroup;

      // const array: Attribute[][] = [];

      // attributeGroups.map((attributeGroup) => {
      //   array.push(attributeGroup.attributes);
      // });

      // const combinations = generateVariants(array);
      // combinations.map(async (combination) => {
      //   const images = [];
      //   const arr = combination.map((group) => {
      //     const attributeObj = {
      //       attributeGroup: { connect: { id: group.attributeGroupId } },
      //       attribute: { connect: { id: group.id } },
      //     };
      //     group.images.map((image) => {
      //       images.push({
      //         publicId: image.publicId,
      //         url: image.url,
      //         importedFromAttribute: true,
      //       });
      //     });
      //     return attributeObj;
      //   });
      //   await prisma.productVariant.create({
      //     data: {
      //       product: { connect: { id: product.id } },
      //       price: product.price,
      //       quantity: 0,
      //       productVariantAttributes: {
      //         create: arr,
      //       },
      //       variantImages: {
      //         create: [...images],
      //       },
      //     },
      //   });
      // });

      return NextResponse.json(`Success.`, { status: 201 });
    } else {
      return NextResponse.json("Route no valid", { status: 500 });
    }
  } catch (error: any) {
    return NextResponse.json(error.message, { status: 500 });
  }
}

function generateVariants(attributeGroupsArray: Attribute[][]) {
  let firstAttributeGroupArray = attributeGroupsArray[0];
  let attributeGroupIncrementor = 1;
  if (attributeGroupIncrementor === attributeGroupsArray.length) {
    return firstAttributeGroupArray.map((attribute) => {
      return [attribute];
    });
  } else {
    const combinations = makeCombinations(firstAttributeGroupArray);
    console.log(combinations);
    return combinations;
  }

  function makeCombinations(arr: any[]) {
    const startArray = arr;
    const combinations = [];

    for (let x = 0; x < startArray.length; x++) {
      for (
        let y = 0;
        y < attributeGroupsArray[attributeGroupIncrementor].length;
        y++
      ) {
        if (Array.isArray(startArray[x])) {
          const temp = [
            ...startArray[x],
            attributeGroupsArray[attributeGroupIncrementor][y],
          ];
          combinations.push(temp);
        } else {
          combinations.push([
            startArray[x],
            attributeGroupsArray[attributeGroupIncrementor][y],
          ]);
        }
      }
    }
    attributeGroupIncrementor++;
    if (attributeGroupIncrementor === attributeGroupsArray.length) {
      return combinations;
    }

    return makeCombinations(combinations);
  }
}
