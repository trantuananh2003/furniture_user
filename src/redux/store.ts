import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/userSlice";
import cartReducer from "./features/cartSlice";
import couponReducer from "./features/couponSlice";

export const store = configureStore({
  reducer: {
    users: userReducer,
    carts: cartReducer,
    coupons: couponReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export default store;
