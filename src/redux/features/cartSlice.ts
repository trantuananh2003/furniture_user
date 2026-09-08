import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CartResponse, CartItemResponse } from "~/model/CartResponse";

export const emptyCart: CartResponse = { id: "", cartItems: [] };

export const cartSlice = createSlice({
  name: "cart",

  initialState: emptyCart,

  reducers: {
    setCart: (state, action: PayloadAction<CartResponse>) => {
      state.id = action.payload.id;
      state.cartItems = action.payload.cartItems;
    },

    updateCartItemQuantity: (
      state,
      action: PayloadAction<{ product_Id: string; quantity: number }>,
    ) => {
      const item = state.cartItems.find(
        (i) => i.product_Id === action.payload.product_Id,
      );
      if (item) {
        item.quantity = action.payload.quantity;
      }
    },

    removeCartItem: (state, action: PayloadAction<string>) => {
      state.cartItems = state.cartItems.filter(
        (i) => i.id !== action.payload,
      );
    },

    clearCart: () => emptyCart,
  },
});

export const {
  setCart,
  updateCartItemQuantity,
  removeCartItem,
  clearCart,
} = cartSlice.actions;
export default cartSlice.reducer;