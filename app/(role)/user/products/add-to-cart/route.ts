import { CartItem, ProductVariant } from "@prisma/client";
import prisma from "lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "pages/api/auth/[...nextauth]";

function itemExistInCart(cartItems: CartItem[], productId: number, variantId: number) {
  for (let i = 0; i < cartItems.length; i++) {
    if (cartItems[i].productId === productId && !variantId) {
      //product that doesnt use variations
      return true;
    } else if (cartItems[i].productId === productId && cartItems[i].variantId === variantId) {
      //product that does use variations
      return true;
    }
  }
  return false;
}

export async function POST(request: NextRequest) {
  if (request.method === "POST") {
    let variant: ProductVariant = null;
    let upsertCartItem: CartItem = null;
    const session = await getServerSession(authOptions);
    const {
      cartItem,
    }: {
      cartItem: {
        productId: number;
        quantity: number;
        variantId: number;
      };
    } = await request.json();

    //get product info from server
    const product = await prisma.product.findFirst({ where: { id: cartItem.productId } });
    //if variant selected find variant details
    if (!(cartItem.variantId === 0)) {
      variant = await prisma.productVariant.findFirst({ where: { id: cartItem.variantId } });
    }
    //find cart
    const cart = await prisma.cart.findFirst({ where: { userId: session.user.id, currentCart: true }, include: { cartItems: true } });
    //get price from server
    const price = variant ? variant.price : product.price;

    if (cart) {
      //check if cartitem exist in cart
      if (itemExistInCart(cart.cartItems, cartItem.productId, cartItem.variantId)) {
        //if product has a variation
        upsertCartItem = await prisma.cartItem.update({
          where: {
            cartId_productId_variantId: {
              cartId: cart.id,
              productId: cartItem.productId,
              variantId: cartItem.variantId ? cartItem.variantId : 0,
            },
          },
          data: {
            quantity: { increment: cartItem.quantity },
          },
        });
      } else {
        //cart item doesnt exist in cart so, add to cart
        upsertCartItem = await prisma.cartItem.create({
          data: {
            cartId: cart.id,
            productName: product.name,
            quantity: cartItem.quantity,
            price: price,
            productId: product.id,
            variantName: variant ? variant.name : null,
            variantId: variant ? variant.id : 0,
          },
        });
      }
      await prisma.cart.update({ where: { id: cart.id }, data: { cartTotal: { increment: price * cartItem.quantity } } });
    } else {
      //create a cart
      const newCart = await prisma.cart.create({ data: { userId: session.user.id, cartTotal: 0 } });
      //add item to newly created cart
      upsertCartItem = await prisma.cartItem.create({
        data: {
          cartId: newCart.id,
          productName: product.name,
          quantity: cartItem.quantity,
          price: price,
          productId: product.id,
          variantName: variant ? variant.name : null,
          variantId: variant ? variant.id : 0,
        },
      });
      await prisma.cart.update({ where: { id: newCart.id }, data: { cartTotal: { increment: price * cartItem.quantity } } });
    }
    return NextResponse.json({
      message: `${cartItem.quantity} ${upsertCartItem.productName}(s) ${variant ? `- (${upsertCartItem.variantName}) ` : ""}added to cart.`,
      status: 200,
    });
  } else {
    return NextResponse.json({ message: "Route no valid", status: 500 });
  }
}
