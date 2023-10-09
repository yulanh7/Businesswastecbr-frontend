// store/index.ts

import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import userReducer from "./userSlice";
import quizReducer from "./quizSlice";
import questionReducer from "./questionSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    quiz: quizReducer,
    question: questionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();

export default store;
