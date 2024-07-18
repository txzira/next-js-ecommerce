import prisma from "lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import db from "@prisma/client";
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

export async function POST(request: NextRequest) {
  try {
    if (request.method === "POST") {
      const {
        cartItems,
        paymentIntent,
        shippingMethod,
        shippingAddress,
      }: {
        cartItems: CartItem[];
        paymentIntent: string;
        shippingMethod: db.ShippingMethod;
        shippingAddress: any;
      } = await request.json();

      const lineItems = [];
      if (cartItems.length) {
        for (let i = 0; i < cartItems.length; i++) {
          const lineItemTotal = await calculateLineItemTotal(cartItems[i]);
          lineItems.push({
            amount: lineItemTotal,
            quantity: cartItems[i].quantity,
            reference: `${cartItems[i].productName}${
              cartItems[i].variant ? cartItems[i].variant?.id : ""
            }`,
            tax_code: "txcd_99999999",
          });
        }

        const taxCalculation = await stripe.tax.calculations.create({
          line_items: lineItems,
          currency: "usd",
          shipping_cost: { shipping_rate: shippingMethod.stripeShippingId },
          customer_details: {
            address: {
              country: shippingAddress.country,
              city: shippingAddress.city,
              line1: shippingAddress.address1,
              line2: shippingAddress.address2,
              postal_code: shippingAddress.postalCode,
              state: shippingAddress.state,
            },
            address_source: "shipping",
          },
        });

        const updatedPaymentIntent = await stripe.paymentIntents.update(
          paymentIntent,
          {
            amount: taxCalculation.amount_total,
            metadata: { tax_calculation_id: taxCalculation.id },
          }
        );

        return NextResponse.json({
          orderTotal: updatedPaymentIntent.amount,
          calculatedTax: taxCalculation.tax_amount_exclusive,
        });
      } else {
        const oldPaymentIntent = await stripe.paymentIntents.retrieve(
          paymentIntent
        );
        const dbShippingMethod = await prisma!.shippingMethod.findFirst({
          where: { id: shippingMethod.id },
        });
        if (dbShippingMethod) {
          const shippingPrice = dbShippingMethod.price * 100;
          const updatedPaymentIntent = await stripe.paymentIntents.update(
            paymentIntent,
            { amount: oldPaymentIntent.amount + shippingPrice }
          );
          return NextResponse.json({
            orderTotal: updatedPaymentIntent.amount,
            calculatedTax: 0,
          });
        }
      }
    } else {
      return NextResponse.json({ message: "Route no valid", status: 500 });
    }
  } catch (error) {
    console.log(error);
  }
}

async function calculateLineItemTotal(lineItem: CartItem): Promise<number> {
  let sum = 0;

  let product:
    | db.Product
    | (db.ProductVariant & { product: db.Product } & {
        productVariantAttributes: (db.ProductVariantAttribute & {
          attribute: db.Attribute;
        })[];
      })
    | null;
  if (lineItem.variant) {
    product = await prisma!.productVariant.findFirst({
      where: {
        AND: [{ id: lineItem.variant?.id }, { productId: lineItem.productId }],
      },
      include: {
        product: true,
        productVariantAttributes: { include: { attribute: true } },
      },
    });
  } else {
    product = await prisma!.product.findFirst({
      where: {
        id: lineItem.productId,
      },
    });
  }
  // Product should exist as this function is called within the calculate order tax route which can only be called after a stripe payment intent was created within the
  // create-payment-intent route. Create-payment-intent route handles both product exist/available validation.

  if (product) {
    // Product price multiplied by 100 to turn price from dollars to cents
    sum += product.price * 100 * lineItem.quantity;
  }

  return sum;
}
