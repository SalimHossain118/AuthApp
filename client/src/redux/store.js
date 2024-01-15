/** @format */

import { combineReducers, configureStore } from "@reduxjs/toolkit";
import UserSliceReucer from "./user/UserSlice";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

// keeping all reducer in one
const allReducers = combineReducers({ user: UserSliceReucer });

const persistConfig = {
  key: "root",
  version: 1,
  storage,
};
const persistedReducer = persistReducer(persistConfig, allReducers);
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
