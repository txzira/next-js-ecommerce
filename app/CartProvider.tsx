"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";

const CartContext: any = createContext(null);

export default function CartProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [cartItems, setCartItems] = useState<any[]>([]);

  const addToCart = (item: any) => {
    let isItemInCart;
    if (cartItems) {
      isItemInCart = cartItems.find((cartItem) => {
        return cartItem.id === item.id;
      });
    }

    if (isItemInCart) {
      setCartItems(
        cartItems.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
            : cartItem
        )
      );
      localStorage.setItem(
        "cartItems",
        JSON.stringify(
          cartItems.map((cartItem) =>
            cartItem.id === item.id
              ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
              : cartItem
          )
        )
      );
    } else {
      setCartItems([...cartItems, { ...item }]);
      localStorage.setItem(
        "cartItems",
        JSON.stringify([...cartItems, { ...item }])
      );
    }
  };

  const removeFromCart = (item: any) => {
    setCartItems(cartItems.filter((cartItem) => cartItem.id !== item.id));
    localStorage.setItem(
      "cartItems",
      JSON.stringify(cartItems.filter((cartItem) => cartItem.id !== item.id))
    );
  };

  const incrementQuantity = (item: any) => {
    setCartItems(
      cartItems.map((cartItem) =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      )
    );
    localStorage.setItem(
      "cartItems",
      JSON.stringify(
        cartItems.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      )
    );
  };

  const decrementQuantity = (item: any) => {
    setCartItems(
      cartItems.map((cartItem: any) =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity - 1 }
          : cartItem
      )
    );
    localStorage.setItem(
      "cartItems",
      JSON.stringify(
        cartItems.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity - 1 }
            : cartItem
        )
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.setItem("cartItems", JSON.stringify([]));
  };
  const getCartTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  useEffect(() => {
    const localStorageCartItems = localStorage.getItem("cartItems");

    if (localStorageCartItems) {
      setCartItems(JSON.parse(localStorageCartItems));
    }
  }, []);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        getCartTotal,
        getTotalItems,
        clearCart,
        addToCart,
        removeFromCart,
        incrementQuantity,
        decrementQuantity,
      }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCartState = () => useContext<any>(CartContext);
