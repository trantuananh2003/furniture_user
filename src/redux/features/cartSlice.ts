import { createSlice } from "@reduxjs/toolkit";
import type { CartResponse } from "~/model/CartResponse";

export const emptyCart: CartResponse = { id: "", cartItems: [] };

export const cartSlice = createSlice({
  name: "cart",

  initialState: emptyCart,

  reducers: {
    setCart: (state, action) => {
      state.id = action.payload.id;
      state.cartItems = action.payload.cartItems;
    },
  },
});

export const { setCart } = cartSlice.actions;
export default cartSlice.reducer;
