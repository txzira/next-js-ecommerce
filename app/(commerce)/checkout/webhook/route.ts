import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});
import prisma from "lib/prisma";
export async function POST(request: NextRequest) {
  const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET!;
  const body = await request.text();
  const sig = request.headers.get("stripe-signature") as string;
  const event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  let orderId;

  switch (event.type) {
    case "payment_intent.succeeded":
      const paymentIntentId = event.data.object.id;
      orderId = event.data.object.metadata.orderId;
      const taxCalculationId = event.data.object.metadata.tax_calculation_id;
      await prisma?.order.update({
        where: { id: Number(orderId) },
        data: {
          status: "PAYMENT_RECEIVED",
        },
      });
      const taxTransaction =
        await stripe.tax.transactions.createFromCalculation({
          calculation: taxCalculationId,
          reference: paymentIntentId,
        });
      await stripe.paymentIntents.update(paymentIntentId, {
        metadata: { tax_transaction: taxTransaction.id },
      });

      console.log(request.url);
      break;
    case "payment_intent.canceled":
      orderId = event.data.object.metadata.orderId;
      await prisma?.order.update({
        where: { id: Number(orderId) },
        data: {
          status: "PAYMENT_FAILED",
        },
      });

      break;
  }

  return NextResponse.json({}, { status: 200 });
}
