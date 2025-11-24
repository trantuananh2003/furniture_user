import { createSlice } from "@reduxjs/toolkit";
import type User from "~/model/User";

export const emptyUserState: User = {
  user_id: "",
  fullName: "",
  email: "",
  birthday: "",
  isMale: "",
  address: "",
  phoneNumber: "",
};

export const userSlice = createSlice({
  name: "user",

  initialState: emptyUserState,

  reducers: {
    setUser: (state, action) => {
      state.user_id = action.payload.user_id;
      state.fullName = action.payload.fullName;
      state.email = action.payload.email;
    },
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
