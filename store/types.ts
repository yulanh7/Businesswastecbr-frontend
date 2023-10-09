import { ThunkAction, Action } from "@reduxjs/toolkit";
import { RootState } from "./index";
import { AxiosError } from "axios";

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export interface ErrorResponse {
  message: string;
}

export interface APIResponse<T> {
  data: T;
}

export interface APIError {
  message: string;
  response?: {
    data: ErrorResponse;
  };
  // Add any additional properties specific to your API error handling
  // For example, you can include status codes, error codes, etc.
}
