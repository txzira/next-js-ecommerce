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
      requestCart,
      shippingMethod,
      calculatedTax,
      orderTotal,
      paymentIntentId,
    }: {
      email: string;
      requestCart: any;
      shippingMethod: db.ShippingMethod;
      calculatedTax: any;
      orderTotal: any;
      paymentIntentId: any;
    } = await request.json();

    const session = await getServerSession(authOptions);

    const cart = await createCart(requestCart, session?.user);

    const order = await prisma!.order.create({
      data: {
        ...(session ? { customerId: session.user.id } : null),
        cartId: cart.id,
        shippingTotal: shippingMethod.price,
        taxTotal: calculatedTax / 100,
        cartTotal: cart.cartTotal,
        orderTotal: orderTotal / 100,
        customerEmail: email,
        status: "PAYMENT_PENDING",
        shippingMethodId: shippingMethod.id,
      },
      include: {
        cart: { include: { cartItems: true } },
        shippingMethod: { select: { name: true, price: true } },
      },
    });
    await stripe.paymentIntents.update(paymentIntentId, {
      metadata: { orderId: order.id },
    });
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
      const product = await prisma!.product.findFirst({
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

  const cart = await prisma!.cart.create({
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
  return await prisma!.productVariant.findFirst({
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
