/** @format */

import { configureStore } from "@reduxjs/toolkit";
import UserSliceReucer from "./user/UserSlice";

export const store = configureStore({
  reducer: { user: UserSliceReucer },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
