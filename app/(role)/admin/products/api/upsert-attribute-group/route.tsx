import prisma from "lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    if (request.method === "POST") {
      const {
        attributeGroups: reqAttributeGroups,
        attributesToDelete,
      }: {
        attributeGroups: {
          productId: number;
          attributeGroup: { id: number; name: string };
          attributes: {
            id: number;
            option: string;
          }[];
        }[];
        attributesToDelete: {
          attributeGroupId: number;
          attributes: number[];
        }[];
      } = await request.json();

      let attributesToDeleteMap = new Map();
      if (attributesToDelete.length) {
        attributesToDeleteMap = new Map(
          attributesToDelete.map((attributeGroup) => [
            attributeGroup.attributeGroupId,
            attributeGroup.attributes,
          ])
        );
      }

      // console.log(attributesToDelete);
      reqAttributeGroups.map(async (reqAttributeGroup) => {
        // console.log(reqAttributeGroup);
        await prisma!.attributeGroup.upsert({
          where: { id: Number(reqAttributeGroup.attributeGroup.id) },
          create: {
            name: reqAttributeGroup.attributeGroup.name,
            product: { connect: { id: Number(reqAttributeGroup.productId) } },
            attributes: {
              createMany: {
                data: reqAttributeGroup.attributes.map((attribute) => {
                  return { name: attribute.option };
                }),
              },
            },
          },
          update: {
            name: reqAttributeGroup.attributeGroup.name,
            attributes: {
              ...(attributesToDeleteMap.has(
                reqAttributeGroup.attributeGroup.id
              ) && {
                delete: attributesToDeleteMap
                  .get(reqAttributeGroup.attributeGroup.id)
                  .map((attributeId: any) => {
                    return { id: Number(attributeId) };
                  }),
              }),
              update: reqAttributeGroup.attributes.map((attribute) => ({
                where: { id: Number(attribute.id) },
                data: { option: attribute.option },
              })),
            },
          },
        });
      });

      return NextResponse.json("Success", { status: 200 });
    } else {
      return NextResponse.json("Route no valid", { status: 500 });
    }
  } catch (error: any) {
    console.log(error.message);
    return NextResponse.json(error.message, { status: 400 });
  }
}
