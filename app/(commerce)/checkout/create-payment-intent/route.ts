import db from "@prisma/client";
import prisma from "lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  typescript: true,
});

interface CartItem {
  id: string;
  productId: number;
  productName: String;
  quantity: number;
  price: number;
  image: string;
  variant: CartItemVariant | undefined;
}
interface CartItemVariant {
  id: number;
  productVariantAttributes: Array<ProductVariantAttribute>;
}
interface ProductVariantAttribute {
  id: number;
  productVariantId: number;
  attibuteGroupId: number;
  attributeId: number;
  attribute: { id: number; name: string; attributeGroupId: number };
  attibuteGroup: { id: number; name: string; productId: number };
}

export async function POST(request: any) {
  try {
    if (request.method === "POST") {
      // Creates a PaymentIntent with order total and sends PaymentIntent's client secret.
      const { cartItems }: { cartItems: CartItem[] } = await request.json();
      const orderTotal = await calculateOrderAmount(cartItems);
      if (orderTotal) {
        const paymentIntent = await stripe.paymentIntents.create({
          amount: orderTotal.sum * 100,
          currency: "usd",
          // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
          automatic_payment_methods: {
            enabled: true,
          },
        });
        return NextResponse.json({
          paymentIntent: paymentIntent.id,
          clientSecret: paymentIntent.client_secret,
          orderTotal: paymentIntent.amount,
          minimumCharged: orderTotal.minimumCharged,
          status: 200,
        });
      }
    } else {
      return NextResponse.json({ message: "Route not valid", status: 500 });
    }
  } catch (error: any) {
    if (error.type === "StripeInvalidRequestError") {
      return NextResponse.json({ status: 500, message: "Stripe order error." });
    } else {
      if (error.code === 1234) {
        return NextResponse.json({
          message: error.message,
          productsNotExist: error.productsNotExist,
          code: error.code,
          status: 400,
        });
      }
      if (error.code === 1235) {
        return NextResponse.json({
          message: error.message,
          productsNotAvailable: error.productsNotAvailable,
          code: error.code,
          status: 400,
        });
      }
      return NextResponse.json({ status: 500, error });
    }
  }
}

async function calculateOrderAmount(cartItems: CartItem[]) {
  // Replace this constant with a calculation of the order's amount
  // Calculate the order total on the server to prevent
  // people from directly manipulating the amount on the client
  let sum = 0;
  let minimumCharged = false;
  let productsNotAvailable = [];
  let productsNotExist = [];

  //using cart items' productId and productVariantId get price from server of product(s) to avoid client side manipulation of prices
  for (let i = 0; i < cartItems.length; i++) {
    let product:
      | db.Product
      | (db.ProductVariant & { product: db.Product } & {
          productVariantAttributes: (db.ProductVariantAttribute & {
            attribute: db.Attribute;
          })[];
        })
      | null;

    if (cartItems[i].variant) {
      product = await prisma!.productVariant.findFirst({
        where: {
          AND: [
            { id: cartItems[i].variant?.id },
            { productId: cartItems[i].productId },
          ],
        },
        include: {
          product: true,
          productVariantAttributes: { include: { attribute: true } },
        },
      });
      //product availability validation
      if (product && !product.available) {
        let variantName = "";
        const productVariantAttributes = product.productVariantAttributes;
        for (let i = 0; i < productVariantAttributes.length; i++) {
          if (i !== productVariantAttributes.length - 1) {
            variantName += productVariantAttributes[i].attribute.name + " - ";
          } else {
            variantName += productVariantAttributes[i].attribute.name;
          }
        }
        productsNotAvailable.push({
          productName: product.product.name,
          isVariant: true,
          variantName,
        });
      }
    } else {
      product = await prisma!.product.findFirst({
        where: {
          id: cartItems[i].productId,
        },
      });
      //product availability validation
      if (product && !product.available) {
        productsNotAvailable.push({
          productName: product.name,
          isVariant: false,
          variantName: "",
        });
      }
    }
    if (product) {
      sum += product.price * cartItems[i].quantity;
    } else {
      //item doesnt exist
      if (cartItems[i].variant) {
        let variantName = "";
        const productVariantAttributes =
          cartItems[i].variant!.productVariantAttributes;
        for (let j = 0; j < productVariantAttributes.length; j++) {
          if (j !== productVariantAttributes.length - 1) {
            variantName += productVariantAttributes[j].attribute.name + " - ";
          } else {
            variantName += productVariantAttributes[j].attribute.name;
          }
        }
        productsNotExist.push({
          productName: cartItems[i].productName,
          isVariant: true,
          variantName,
        });
      } else {
        productsNotExist.push({
          productName: cartItems[i].productName,
          isVariant: false,
          variantName: "",
        });
      }
    }
  }
  if (productsNotExist.length) {
    throw {
      message:
        "Product(s) in the cart does not exist. Remove the following product(s) from your cart:",
      products: JSON.stringify(productsNotExist),
    };
  }
  if (productsNotAvailable.length) {
    throw {
      message:
        "Product(s) in the cart does are not available. Remove the following product(s) from your cart:",
      products: JSON.stringify(productsNotAvailable),
    };
  }
  if (sum === 0) {
    //minimum stripe charge
    sum += 1;
    minimumCharged = true;
  }

  return { sum, minimumCharged };
}
