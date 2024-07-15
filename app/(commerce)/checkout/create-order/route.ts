import prisma from "lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import db from "@prisma/client";
import { sendEmail } from "lib/nodemailer";
import { getServerSession } from "next-auth";
import { authOptions } from "pages/api/auth/[...nextauth]";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
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
    const {
      email,
      requestShippingForm,
      requestBillingForm,
      requestCart,
      shippingMethod,
      calculatedTax,
      orderTotal,
      paymentIntentId,
    }: {
      email: string;
      requestShippingForm: CustomerInfoProps;
      requestBillingForm: CustomerInfoProps;
      requestCart: any;
      shippingMethod: db.ShippingMethod;
      calculatedTax: any;
      orderTotal: any;
      paymentIntentId: any;
    } = await request.json();

    console.log({
      email,
      requestShippingForm,
      requestBillingForm,
      requestCart,
      shippingMethod,
      calculatedTax,
      orderTotal,
      paymentIntentId,
    });
    const session = await getServerSession(authOptions);
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    const charge = await stripe.charges.retrieve(
      paymentIntent.latest_charge?.toString()!
    );
    const card = charge.payment_method_details?.card!;

    const cart = await createCart(requestCart, session?.user);

    const dbCard = await prisma.card.create({
      data: {
        brand: card.brand!,
        lastFourDigits: card.last4!,
        expir_month: card.exp_month!,
        expir_year: card.exp_year!,
      },
    });

    const order = await prisma.order.create({
      data: {
        ...(session ? { customerId: session.user.id } : null),
        cartId: cart.id,
        shippingTotal: shippingMethod.price,
        taxTotal: calculatedTax,
        cartTotal: cart.cartTotal,
        orderTotal: orderTotal,
        customerEmail: email,
        status: "PAYMENT_PENDING",
        shippingMethodId: shippingMethod.id,
        cardId: dbCard.id,
      },
      include: {
        cart: { include: { cartItems: true } },
        shippingMethod: { select: { name: true, price: true } },
      },
    });

    const shippingAddress = await prisma.orderShippingAddress.create({
      data: {
        firstName: requestShippingForm.firstName,
        lastName: requestShippingForm.lastName,
        phone: requestShippingForm.phone,
        country: requestShippingForm.country,
        streetAddress: requestShippingForm.streetAddress,
        streetAddress2: requestShippingForm.streetAddress2,
        city: requestShippingForm.city,
        state: requestShippingForm.state,
        zipCode: requestShippingForm.postalCode,
        order_id: order.id,
      },
    });

    const billingAddress = await prisma.orderBillingAddress.create({
      data: {
        firstName: requestBillingForm.firstName,
        lastName: requestBillingForm.lastName,
        phone: requestBillingForm.phone,
        country: requestBillingForm.country,
        streetAddress: requestBillingForm.streetAddress,
        streetAddress2: requestBillingForm.streetAddress2,
        city: requestBillingForm.city,
        state: requestBillingForm.state,
        zipCode: requestBillingForm.postalCode,
        order_id: order.id,
      },
    });

    //email confirmation
    const usDollarformatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    });

    const orderCart = order.cart.cartItems;
    let orderCartHtmlList = "";
    for (let i = 0; i < orderCart.length; i++) {
      const cartItemHtml = `
        <tr style="width:100%; border-bottom: 1px solid;">
          <td colspan="1">
            <img src="${
              orderCart[i].image
            }" width="75px" height="75px" alt="cart-item-image"/>
          </td>
          <td colspan="1">
            <p style="font-weight:600;">${orderCart[i].productName} x ${
        orderCart[i].quantity
      }</p>
            ${
              orderCart[i].variantName
                ? `<p style="color:gray;">${orderCart[i].variantName}</p>`
                : ""
            }
          </td>
          <td style="font-weight:600;" colspan="1">${usDollarformatter.format(
            orderCart[i].price
          )}</td>
        </tr>
      `;
      orderCartHtmlList += cartItemHtml;
    }

    const htmlPart = `
    <div style="width:75%; margin:0 auto; color:black;">
      <div style="text-align:center;">
        <img width="550px" height="75px" src="${process.env.COMPANY_LOGO} "/>
      </div>
      <p>Hello ${shippingAddress.firstName},</p>
      <br/>
      <p>This is a quick email to say we've received your order.</p>
      <p>Once everything is confirmed and ready to ship, we'll send you another email with the tracking details and any other information about your package.</p>
      <p>Your shipping ETA applies from the time you receive this email which should be about one working day from now. We'll follow up as quickly as possible!</p>
      <p>In the meantime, if you have any questions, send us an email at -company email- and we'll be happy to help.</p>
      <br/>
      <hr/>
      <br/>
      <h2>Order Summary</h2>
      <table style="width:80%; border-collapse: collapse;">
        <tbody>
          ${orderCartHtmlList}
          <tr style="width:100%; padding-top:8px;">
            <td colspan="1"></td>
            <td style="font-weight:600;" colspan="1">Sub-total</td>
            <td style="font-weight:600;" colspan="1">${usDollarformatter.format(
              order.cartTotal
            )}</td>
          </tr>
          <tr style="width:100%;">
            <td colspan="1"></td>
            <td style="font-weight:600;" colspan="1">Shipping</td>
            <td style="font-weight:600;" colspan="1">${usDollarformatter.format(
              order.shippingTotal
            )}</td>
          </tr>
          <tr style="width:100%; border-bottom: 1px solid; padding-bottom:8px;">
            <td colspan="1"></td>
            <td style="font-weight:600;" colspan="1">Taxes</td>
            <td style="font-weight:600;" colspan="1">${usDollarformatter.format(
              order.taxTotal / 100
            )}</td>
          </tr>
          <tr style="width:100%;">
            <td colspan="1"></td>
            <td style="font-weight:600;" colspan="1">Total</td>
            <td style="font-weight:600;" colspan="1">${usDollarformatter.format(
              order.orderTotal / 100
            )}</td>
          </tr>
        </tbody>
      </table>
      <br/>
      <hr/>
      <br/>
      <h2>Customer Information</h2>
      <div style="display:flex; width:100%;">
        <div style="margin-right: 150px;">
          <h3>Shipping Address</h3>
          <div>
            <p style="margin:0;">${shippingAddress.firstName} ${
      shippingAddress.lastName
    }</p>
            <p style="margin:0;">${shippingAddress.streetAddress}${
      shippingAddress.streetAddress2 ? ` ${shippingAddress.streetAddress2}` : ""
    }</p>
            <p style="margin:0;">${shippingAddress.city}, ${
      shippingAddress.state
    } ${shippingAddress.zipCode}</p>
            <p style="margin:0;">${shippingAddress.country}</p>
          </div>
        </div>
        <div >
          <h3>Billing Address</h3>
          <div>
            <p style="margin:0;">${billingAddress.firstName} ${
      billingAddress.lastName
    }</p>
            <p style="margin:0;">${billingAddress.streetAddress}${
      billingAddress.streetAddress2 ? ` ${billingAddress.streetAddress2}` : ""
    }</p>
            <p style="margin:0;">${billingAddress.city}, ${
      billingAddress.state
    } ${billingAddress.zipCode}</p>
            <p style="margin:0;">${billingAddress.country}</p>
          </div>
        </div>
      </div>
      <div style="display:flex; width:100%; ">
        <div style="margin-right: 150px;">
            <h3>Shipping Method</h3>
            <p style="margin:0;">${
              order.shippingMethod.name
            } - ${usDollarformatter.format(order.shippingMethod.price)}</p>
        </div>
        <div>
            <h3>Payment Method</h3>
            <p style="margin:0;">${
              charge.payment_method_details?.card?.brand
            } - ${usDollarformatter.format(order.orderTotal / 100)}</p>
            
        </div>

      </div>



      <p>-Your favorite shreders at ${process.env.COMPANY_NAME}</p>
    </div>
  `;

    const subject = `Order No. ${order.id} Confirmation - ${process.env.COMPANY_NAME}`;

    await sendEmail(
      order.customerEmail,
      `${shippingAddress.firstName} ${shippingAddress.lastName}`,
      subject,
      htmlPart
    );
    return NextResponse.json(
      {
        message: "success",
        order: { id: order.id, email: order.customerEmail },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.log(error.message);
    return NextResponse.json({ message: "Failed" }, { status: 400 });
  }
}

async function createCart(_cartItems: CartItem[], user: any = null) {
  let cartSum = 0;
  const cartItems: any = [];
  for (let i = 0; i < _cartItems.length; i++) {
    if (_cartItems[i].variant) {
      const productVariant = await getProductVariant(_cartItems[i].variant!.id);
      if (productVariant) {
        const { productName, variantName } =
          makeProductVariantName(productVariant);
        cartItems.push({
          productId: productVariant.productId,
          variantId: productVariant.id,
          productName: productName,
          image: _cartItems[i].image,
          variantName: variantName,
          price: productVariant.price,
          quantity: _cartItems[i].quantity,
        });
        cartSum += productVariant.price * _cartItems[i].quantity;
      } else {
        console.log("ERROR: Invalid product variant in cart");
      }
    } else {
      const product = await prisma.product.findFirst({
        where: { id: _cartItems[i].productId },
      });

      if (product) {
        cartItems.push({
          productId: product.id,
          productName: product.name,
          price: product.price,
          image: _cartItems[i].image,
          quantity: _cartItems[i].quantity,
        });
        cartSum += product.price * _cartItems[i].quantity;
      } else {
        console.log("ERROR: Invalid product in cart");
      }
    }
  }

  const cart = await prisma.cart.create({
    data: {
      ...(user && { userId: user.id }),
      currentCart: false,
      cartTotal: cartSum,
      cartItems: {
        createMany: {
          data: cartItems,
        },
      },
    },
  });
  return cart;
}

async function getProductVariant(variantId: number) {
  return await prisma.productVariant.findFirst({
    where: { id: variantId },
    include: {
      product: true,
      productVariantAttributes: {
        include: { attribute: true, attributeGroup: true },
      },
    },
  });
}

function makeProductVariantName(
  productVariant: db.ProductVariant & {
    product: db.Product;
    productVariantAttributes: (db.ProductVariantAttribute & {
      attributeGroup: db.AttributeGroup;
      attribute: db.Attribute;
    })[];
  }
) {
  let variantName: string = "";

  productVariant.productVariantAttributes.map(
    (productVariantAttribute, index: number) => {
      const group = productVariantAttribute.attributeGroup.name;
      const option = productVariantAttribute.attribute.name;
      variantName += group + ": " + option;
      productVariant.productVariantAttributes.length - 1 > index
        ? (variantName += " - ")
        : null;
    }
  );

  return {
    productName: productVariant.product.name,
    variantName: variantName,
  };
}
