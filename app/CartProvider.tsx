"use client";
import React, { createContext, useContext, useReducer } from "react";

const CartStateContext = createContext(null);
const CartDispatchContext = createContext(null);

const ACTIONS = {
  INCREMENT: "increment",
  DECREMENT: "decrement",
  SET_CART: "SET_CART",
};

const initialState = {
  total_items: 0,
  total_unique_items: 0,
  line_items: [],
};

const reducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_CART:
      return { ...state, ...action.payload };
    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
};

export default function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // useEffect(() => {
  //   getCart();
  // }, []);
  const setCart = (payload) => dispatch({ type: ACTIONS.SET_CART, payload });
  // const getCart = async () => {
  //   try {
  //     const cart = await commerce.cart.retrieve();
  //     setCart(cart);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };
  return (
    <CartStateContext.Provider value={state}>
      <CartDispatchContext.Provider value={{ setCart }}>{children}</CartDispatchContext.Provider>
    </CartStateContext.Provider>
  );
}

export const useCartState = () => useContext(CartStateContext);
export const useCartDispatch = () => useContext(CartDispatchContext);
