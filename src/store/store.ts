import { configureStore } from "@reduxjs/toolkit";
import characterReducer from "./characterSlice";
import teamReducer from "./teamSlice";

export const store = configureStore({
  reducer: {
    characters: characterReducer,
    team: teamReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
