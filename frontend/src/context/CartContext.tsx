import { Food } from "@/api/types";
import React, { createContext, useContext, useState } from "react";

type CartItem = Food & {
  quantity: number;
};

type CartContextType = {
  cartItems: CartItem[];
  addToCart: (food: Food) => void;
  removeFromCart: (foodId: string) => void;
  increaseQuantity: (foodId: string) => void;
  decreaseQuantity: (foodId: string) => void;
  totalAmount: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider(props: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  function addToCart(food: Food) {
    setCartItems((currentItems) => {
      const existingItem = currentItems.find((item) => item._id === food._id);

      if (existingItem) {
        return currentItems.map((item) =>
          item._id === food._id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item,
        );
      }

      return [
        ...currentItems,
        {
          ...food,
          quantity: 1,
        },
      ];
    });
  }

  function removeFromCart(foodId: string) {
    setCartItems((currentItems) =>
      currentItems.filter((item) => item._id !== foodId),
    );
  }

  function increaseQuantity(foodId: string) {
    setCartItems((currentItems) =>
      currentItems.map((item) =>
        item._id === foodId
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item,
      ),
    );
  }

  function decreaseQuantity(foodId: string) {
    setCartItems((currentItems) =>
      currentItems
        .map((item) =>
          item._id === foodId
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }

  const totalAmount = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={
        //  {
        //   cartItems: cartItems,
        //   addToCart: addToCart,
        //   removeFromCart: removeFromCart,
        //   increaseQuantity: increaseQuantity,
        //   decreaseQuantity: decreaseQuantity,
        //   totalAmount: totalAmount,
        // }
        {
          cartItems,
          addToCart,
          removeFromCart,
          increaseQuantity,
          decreaseQuantity,
          totalAmount,
        }
      }
    >
      {props.children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}
