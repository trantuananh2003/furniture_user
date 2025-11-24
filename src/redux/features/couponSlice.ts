import { createSlice } from "@reduxjs/toolkit";
import type { Coupon } from "~/model/Coupon";

export const emptyCoupon: Coupon[] = [];

export const couponSlice = createSlice({
  name: "coupon",
  initialState: emptyCoupon,
  reducers: {
    setCoupon: (state, action) => {
      const newCoupons = action.payload; // payload có thể là một coupon hoặc mảng coupon
      if (Array.isArray(newCoupons)) {
        // Nếu là mảng, thêm toàn bộ
        newCoupons.forEach((coupon) => {
          if (!state.some((item) => item.codeCoupon === coupon.codeCoupon)) {
            state.push(coupon);
          }
        });
      } else {
        // Nếu là một coupon, thêm nếu chưa tồn tại
        if (!state.some((item) => item.codeCoupon === newCoupons.codeCoupon)) {
          state.push(newCoupons);
        }
      }
    },
  },
});

export const { setCoupon } = couponSlice.actions;
export default couponSlice.reducer;
