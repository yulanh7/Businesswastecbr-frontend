import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk } from "./types";
import {
  fetchAllGroupLeaders,
  registerGroupLeader,
  updateGroupLeader,
  login,
  fetchAllUsers,
  forgetPassword,
  resetPassword,
  fetchAllAdmin,
  registerUser,
  updateUser,
  bulkDeleteGroupLeaders,
  bulkResetPWGroupLeaders,
  bulkDeleteAdmin,
  bulkResetPWAdmin,
  bulkDeleteUsers,
  bulkResetPWUsers,
  changePassword,
  bulkAddNormalUsers,
  fetchSelfDetail,
  updateSelfDetail,
  contactUs,
  askAQuestion,
  registerAdmin,
  updateAdmin,
} from "../api/api";
import Router from "next/router";
import {
  addGroupLeaderProps,
  updateGroupLeaderProps,
  updateUserProps,
  fetchUsesProps,
  updateSelfDetailProps,
  defaultUsersObject,
  contactUsProps,
  addUserProps,
  fetchAdminProps,
} from "../ultility/interfaces";

const defaultSelfDetailProps = {
  firstName: "",
  lastName: "",
  email: "",
};

interface UsersProps {
  pageIdx: any;
  pageSize: any;
  totalRecord: any;
  records: any;
}

interface UserData {
  userWithData: any; // Replace any with the actual type for user
  userInfo: any;
  token: any;
  allUsers: UsersProps;
  isAuthenticated: boolean;
  allGroupLeaders: UsersProps;
  allAdmin: any;
  fetchUserLoading: boolean;
  submitUserLoading: boolean;
  fetchUserError: string | null;
  fetchUserMessage: string | null;
  submitUserError: string | null;
  submitUserMessage: string | null;
  bulkAddUserMessage: any;
  selfDetail: any;
}

const initialState: UserData = {
  userWithData: null,
  userInfo: null,
  token: null,
  allUsers: defaultUsersObject,
  isAuthenticated: false,
  allGroupLeaders: defaultUsersObject,
  allAdmin: null,
  fetchUserLoading: false,
  submitUserLoading: false,
  fetchUserError: null,
  fetchUserMessage: null,
  submitUserError: null,
  submitUserMessage: null,
  bulkAddUserMessage: null,
  selfDetail: defaultSelfDetailProps,
};

const useSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    resetForm: (state) => {
      state.fetchUserError = null;
      state.fetchUserMessage = null;
      state.submitUserError = null;
      state.submitUserMessage = null;
      state.bulkAddUserMessage = null;
    },
    fetchUserStart: (state) => {
      state.fetchUserLoading = true;
      state.fetchUserError = null;
      state.fetchUserMessage = null;
    },
    fetchAllUsersSuccess: (state, action: PayloadAction<any>) => {
      state.allUsers = action.payload || defaultUsersObject;
      state.fetchUserLoading = false;
    },
    fetchSelfDetailSuccess: (state, action: PayloadAction<any>) => {
      state.selfDetail = action.payload;
      state.fetchUserLoading = false;
    },
    fetchAllGroupLeadersSuccess: (state, action: PayloadAction<any>) => {
      state.allGroupLeaders = action.payload;
      state.fetchUserLoading = false;
    },

    fetchAllAdminSuccess: (state, action: PayloadAction<any>) => {
      state.allAdmin = action.payload;
      state.fetchUserLoading = false;
    },
    fetchUserFailure: (state, action: PayloadAction<any>) => {
      state.fetchUserLoading = false;
      state.fetchUserMessage = null;
      state.fetchUserError = action.payload;
    },
    submitUserStart: (state) => {
      state.submitUserLoading = true;
      state.submitUserError = null;
      state.submitUserMessage = null;
    },
    submitLoginSuccess: (state, action: PayloadAction<any>) => {
      state.submitUserLoading = false;
      state.submitUserMessage = "Fetch successfully";
      state.token = action.payload;
    },
    submitFormSuccess: (state, action: PayloadAction<any>) => {
      state.submitUserLoading = false;
      state.submitUserMessage = action.payload;
      state.token = action.payload;
    },
    updateGroupLeaderSuccess: (state, action: PayloadAction<any>) => {
      state.allGroupLeaders = action.payload;
    },
    updateAdminSuccess: (state, action: PayloadAction<any>) => {
      state.allAdmin = action.payload;
    },
    submitUserSuccess: (state, action: PayloadAction<any>) => {
      state.submitUserLoading = false;
      state.submitUserMessage = action.payload;
      state.submitUserError = null;
    },
    bulkAddUserSuccess: (state, action: PayloadAction<any>) => {
      state.submitUserLoading = false;
      state.bulkAddUserMessage = action.payload;
      state.submitUserError = null;
    },
    submitUserFailure: (state, action: PayloadAction<any>) => {
      state.submitUserLoading = false;
      state.submitUserMessage = null;
      state.bulkAddUserMessage = null;
      state.submitUserError = action.payload;
    },
  },
});

export const {
  resetForm,
  fetchUserStart,
  fetchAllUsersSuccess,
  fetchAllGroupLeadersSuccess,
  updateGroupLeaderSuccess,
  fetchAllAdminSuccess,
  fetchUserFailure,
  submitLoginSuccess,
  submitUserStart,
  submitUserSuccess,
  submitUserFailure,
  fetchSelfDetailSuccess,
  bulkAddUserSuccess,
  submitFormSuccess,
} = useSlice.actions;
export default useSlice.reducer;

export const fetchAllUsersSlice =
  (
    payload: fetchUsesProps
  ): AppThunk<Promise<void>> => // Add <Promise<void>> to specify the return type
  async (dispatch) => {
    try {
      dispatch(fetchUserStart());
      const { data } = await fetchAllUsers(payload);
      dispatch(fetchAllUsersSuccess(data));
    } catch (error: any) {
      dispatch(fetchUserFailure((error as Error).message));
    }
  };
export const fetchSelfDetailSlice =
  (): AppThunk<Promise<void>> => // Add <Promise<void>> to specify the return type
  async (dispatch) => {
    try {
      dispatch(fetchUserStart());
      const response = await fetchSelfDetail();
      dispatch(fetchSelfDetailSuccess(response));
    } catch (error: any) {
      dispatch(fetchUserFailure((error as Error).message));
    }
  };
export const fetchAllGroupLeadersSlice =
  (
    payload: fetchUsesProps
  ): AppThunk<Promise<void>> => // Add <Promise<void>> to specify the return type
  async (dispatch) => {
    try {
      dispatch(fetchUserStart());
      const { data } = await fetchAllGroupLeaders(payload);
      dispatch(fetchAllGroupLeadersSuccess(data));
    } catch (error: any) {
      dispatch(fetchUserFailure((error as Error).message));
    }
  };
export const fetchAllAdminSlice =
  (
    payload: fetchAdminProps
  ): AppThunk<Promise<void>> => // Add <Promise<void>> to specify the return type
  async (dispatch) => {
    try {
      dispatch(fetchUserStart());
      const response = await fetchAllAdmin(payload);
      dispatch(fetchAllAdminSuccess(response));
    } catch (error: any) {
      dispatch(fetchUserFailure((error as Error).message));
    }
  };

export const loginSlice =
  (payload: {
    email: string;
    password: string;
  }): AppThunk<Promise<void>> => // Add <Promise<void>> to specify the return type
  async (dispatch) => {
    try {
      dispatch(submitUserStart());
      const { token, user } = await login(payload);
      dispatch(submitLoginSuccess(token));
      localStorage.setItem("actTraintoken", token);
      localStorage.setItem("userInfo", JSON.stringify(user));
      const previousRoute = localStorage.getItem("previousRoute");
      Router.push("/"); // Navigate to home page
      // if (previousRoute === "/login") {
      // } else {
      //   Router.back(); // Navigate back to the previous page
      // }
    } catch (error: any) {
      dispatch(submitUserFailure(error.message));
    }
  };
export const changePasswordSlice =
  (payload: {
    currentPassword: string;
    newPassword: string;
  }): AppThunk<Promise<void>> => // Add <Promise<void>> to specify the return type
  async (dispatch) => {
    try {
      dispatch(submitUserStart());

      const { message, token } = await changePassword(payload);
      localStorage.setItem("actTraintoken", token);
      dispatch(submitUserSuccess(message));
    } catch (error: any) {
      dispatch(submitUserFailure(error.message));
    }
  };
export const updateSelfDetailSlice =
  (
    payload: updateSelfDetailProps
  ): AppThunk<Promise<void>> => // Add <Promise<void>> to specify the return type
  async (dispatch) => {
    try {
      dispatch(submitUserStart());
      const { message, token } = await updateSelfDetail(payload);
      localStorage.setItem("actTraintoken", token);
      dispatch(submitUserSuccess(message));
      dispatch(fetchUserStart());
      const response = await fetchSelfDetail();
      dispatch(fetchSelfDetailSuccess(response));
    } catch (error: any) {
      dispatch(submitUserFailure(error.message));
      dispatch(fetchUserFailure((error as Error).message));
    }
  };

export const forgetPasswordSlice =
  (payload: {
    email: string;
  }): AppThunk<Promise<void>> => // Add <Promise<void>> to specify the return type
  async (dispatch) => {
    try {
      dispatch(submitUserStart());
      const { message } = await forgetPassword(payload);
      dispatch(submitUserSuccess(message));
    } catch (error: any) {
      dispatch(submitUserFailure(error.message));
    }
  };

export const resetPasswordSlice =
  (payload: {
    password: string;
    token: string;
  }): AppThunk<Promise<void>> => // Add <Promise<void>> to specify the return type
  async (dispatch) => {
    try {
      dispatch(submitUserStart());
      const { message } = await resetPassword(payload);
      dispatch(submitUserSuccess(message));
    } catch (error: any) {
      dispatch(submitUserFailure(error.message));
    }
  };

export const registerGroupLeaderSlice =
  (
    payload: addGroupLeaderProps
  ): AppThunk<Promise<void>> => // Add <Promise<void>> to specify the return type
  async (dispatch) => {
    try {
      dispatch(submitUserStart());
      const { message } = await registerGroupLeader(payload);
      dispatch(submitUserSuccess("Submit successfully"));
      const groupLeaderPage = localStorage.getItem("groupLeaderPage") || 1;
      const { data } = await fetchAllGroupLeaders({
        page: groupLeaderPage,
      });
      dispatch(fetchAllGroupLeadersSuccess(data));
    } catch (error: any) {
      dispatch(submitUserFailure(error.message));
    }
  };
export const registerAdminSlice =
  (
    payload: addUserProps
  ): AppThunk<Promise<void>> => // Add <Promise<void>> to specify the return type
  async (dispatch) => {
    try {
      dispatch(submitUserStart());
      const { message } = await registerAdmin(payload);
      dispatch(submitUserSuccess("Submit successfully"));
      // const normalUserPage = localStorage.getItem("normalUserPage") || 1;
      const response = await fetchAllAdmin({});
      dispatch(fetchAllAdminSuccess(response));
    } catch (error: any) {
      dispatch(submitUserFailure(error.message));
    }
  };
export const registerUserSlice =
  (
    payload: addUserProps
  ): AppThunk<Promise<void>> => // Add <Promise<void>> to specify the return type
  async (dispatch) => {
    try {
      dispatch(submitUserStart());
      const { message } = await registerUser(payload);
      dispatch(submitUserSuccess("Submit successfully"));
      const normalUserPage = localStorage.getItem("normalUserPage") || 1;
      const { data } = await fetchAllUsers({
        page: normalUserPage,
      });
      dispatch(fetchAllUsersSuccess(data));
    } catch (error: any) {
      dispatch(submitUserFailure(error.message));
    }
  };

export const updateUserSlice =
  (
    payload: updateUserProps
  ): AppThunk<Promise<void>> => // Add <Promise<void>> to specify the return type
  async (dispatch) => {
    try {
      dispatch(submitUserStart());
      const { message } = await updateUser(payload);
      dispatch(submitUserSuccess("Submit successfully"));
      const normalUserPage = localStorage.getItem("normalUserPage") || 1;
      const { data } = await fetchAllUsers({
        page: normalUserPage,
        businessId: payload.businessId,
      });
      dispatch(fetchAllUsersSuccess(data));
    } catch (error: any) {
      dispatch(submitUserFailure(error.message));
    }
  };
export const updateGroupLeaderSlice =
  (
    payload: updateGroupLeaderProps
  ): AppThunk<Promise<void>> => // Add <Promise<void>> to specify the return type
  async (dispatch) => {
    try {
      dispatch(submitUserStart());
      const { message } = await updateGroupLeader(payload);
      const groupLeaderPage = localStorage.getItem("groupLeaderPage") || 1;

      const { data } = await fetchAllGroupLeaders({
        page: groupLeaderPage,
      });
      dispatch(fetchAllGroupLeadersSuccess(data));
    } catch (error: any) {
      dispatch(submitUserFailure(error.message));
    }
  };
export const updateAdminSlice =
  (
    payload: updateGroupLeaderProps
  ): AppThunk<Promise<void>> => // Add <Promise<void>> to specify the return type
  async (dispatch) => {
    try {
      dispatch(submitUserStart());
      await updateAdmin(payload);
      const response = await fetchAllAdmin({});
      dispatch(fetchAllAdminSuccess(response));
    } catch (error: any) {
      dispatch(submitUserFailure(error.message));
    }
  };

export const bulkDeleteGroupLeadersSlice =
  (
    payload: any
  ): AppThunk<Promise<void>> => // Add <Promise<void>> to specify the return type
  async (dispatch) => {
    try {
      dispatch(submitUserStart());
      const { message } = await bulkDeleteGroupLeaders(payload);
      dispatch(submitUserSuccess("Submit successfully"));
      const groupLeaderPage = localStorage.getItem("groupLeaderPage") || 1;
      const { data } = await fetchAllGroupLeaders({
        page: groupLeaderPage,
      });
      dispatch(fetchAllGroupLeadersSuccess(data));
    } catch (error: any) {
      dispatch(submitUserFailure(error.message));
    }
  };
export const bulkResetPWGroupLeadersSlice =
  (
    payload: any
  ): AppThunk<Promise<void>> => // Add <Promise<void>> to specify the return type
  async (dispatch) => {
    try {
      dispatch(submitUserStart());
      const { message } = await bulkResetPWGroupLeaders(payload);
      dispatch(submitUserSuccess("Submit successfully"));
    } catch (error: any) {
      dispatch(submitUserFailure(error.message));
    }
  };

export const bulkDeleteAdminSlice =
  (
    payload: any
  ): AppThunk<Promise<void>> => // Add <Promise<void>> to specify the return type
  async (dispatch) => {
    try {
      dispatch(submitUserStart());
      const { message } = await bulkDeleteAdmin(payload);
      dispatch(submitUserSuccess("Submit successfully"));
      const response = await fetchAllAdmin(payload);
      dispatch(fetchAllAdminSuccess(response));
    } catch (error: any) {
      dispatch(submitUserFailure(error.message));
    }
  };
export const bulkResetPWAdminSlice =
  (
    payload: any
  ): AppThunk<Promise<void>> => // Add <Promise<void>> to specify the return type
  async (dispatch) => {
    try {
      dispatch(submitUserStart());
      const { message } = await bulkResetPWAdmin(payload);
      dispatch(submitUserSuccess("Submit successfully"));
    } catch (error: any) {
      dispatch(submitUserFailure(error.message));
    }
  };

export const bulkDeleteUsersSlice =
  (
    payload: any
  ): AppThunk<Promise<void>> => // Add <Promise<void>> to specify the return type
  async (dispatch) => {
    try {
      dispatch(submitUserStart());
      const { message } = await bulkDeleteUsers(payload);

      dispatch(submitUserSuccess("Submit successfully"));
      const normalUserPage = localStorage.getItem("normalUserPage") || 1;
      const { data } = await fetchAllUsers({
        page: normalUserPage,
      });
      dispatch(fetchAllUsersSuccess(data));
    } catch (error: any) {
      dispatch(submitUserFailure(error.message));
    }
  };
export const bulkResetPWUsersSlice =
  (
    payload: any
  ): AppThunk<Promise<void>> => // Add <Promise<void>> to specify the return type
  async (dispatch) => {
    try {
      dispatch(submitUserStart());
      const { message } = await bulkResetPWUsers(payload);
      dispatch(submitUserSuccess("Submit successfully"));
    } catch (error: any) {
      dispatch(submitUserFailure(error.message));
    }
  };

export const bulkAddNormalUsersSlice =
  (file: File): AppThunk<Promise<void>> =>
  async (dispatch) => {
    try {
      dispatch(submitUserStart());
      const response = await bulkAddNormalUsers(file);
      dispatch(bulkAddUserSuccess(response));
      const normalUserPage = localStorage.getItem("normalUserPage") || 1;
      const { data } = await fetchAllUsers({
        page: normalUserPage,
      });
      dispatch(fetchAllUsersSuccess(data));
    } catch (error: any) {
      if (error.message) {
        dispatch(submitUserFailure(error.message));
        return;
      }
      dispatch(submitUserFailure(error));
    }
  };
export const contactUsSlice =
  (payload: contactUsProps): AppThunk<Promise<void>> =>
  async (dispatch) => {
    try {
      dispatch(submitUserStart());
      const response = await contactUs(payload);
      dispatch(submitFormSuccess(response));
    } catch (error: any) {
      if (error.message) {
        dispatch(submitUserFailure(error.message));
        return;
      }
      dispatch(submitUserFailure(error));
    }
  };
export const askAQuestionSlice =
  (payload: { userQuestion: string }): AppThunk<Promise<void>> =>
  async (dispatch) => {
    try {
      dispatch(submitUserStart());
      const response = await askAQuestion(payload);
      dispatch(submitFormSuccess(response));
    } catch (error: any) {
      if (error.message) {
        dispatch(submitUserFailure(error.message));
        return;
      }
      dispatch(submitUserFailure(error));
    }
  };
