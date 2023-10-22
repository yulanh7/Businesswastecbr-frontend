import axios from "axios";
import {
  addGroupLeaderProps,
  addUserProps,
  updateGroupLeaderProps,
  updateUserProps,
  fetchUsesProps,
  updateSelfDetailProps,
  contactUsProps,
  fetchAdminProps,
} from "../ultility/interfaces";
import Router from "next/router";

// const API_URL = process.env.NEXT_PUBLIC_API_URL;
const API_URL = "https://dev.training.actsmartbusiness.com.au:3045";
const api = axios.create({
  baseURL: API_URL,
});

const limit = 10;

let isTokenErrorHandled = false;

const navigateToHomeOnTokenError = (error: any) => {
  if (
    !isTokenErrorHandled &&
    error.response &&
    (error.response.status === 401 || error.response.status === 403)
  ) {
    isTokenErrorHandled = true;
    localStorage.removeItem("userInfo");
    alert("Please login. Your session is invalid or expired.");
    Router.push("/login")
      .then(() => {
        // Reset the flag after navigation so it can work for subsequent errors
        isTokenErrorHandled = false;
      })
      .catch(() => {
        // Handle navigation error
        isTokenErrorHandled = false;
      });
  }
};

const getHeaders = () => {
  const token = localStorage.getItem("actTraintoken");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const makeRequest = async (
  method: "get" | "post" | "put" | "delete",
  url: string,
  payload?: any,
  needsAuth = true
) => {
  try {
    const headers = needsAuth ? getHeaders() : {};
    let response;
    switch (method) {
      case "get":
        response = await api.get(url, { headers, params: payload });
        break;
      case "put":
        response = await api.put(url, payload, { headers }); // Send payload in the request body
        break;
      case "delete":
        response = await api.delete(url, { headers, params: payload });
        break;
      default:
        response = await api.post(url, payload, { headers });
    }
    // const response =
    //   method === "get"
    //     ? await api.get(url, { headers, params: payload })
    //     : await api.post(url, payload, { headers });
    return response.data;
  } catch (error: any) {
    navigateToHomeOnTokenError(error);
    if (error.response && error.response.data) {
      throw error.response.data;
    }
    throw error;
  }
};

export const getUserInfo = () => makeRequest("post", `/api/user/userInfo`);

export const getUserScore = (payload: { userId: string }) =>
  makeRequest("get", `/api/users/highest-score/${payload.userId}`);

export const forgetPassword = (payload: { email: string }) =>
  makeRequest("post", `/api/users/forgotPassword`, payload);

export const resetPassword = (payload: { token: string; password: string }) =>
  makeRequest("post", `/api/users/resetPassword/${payload.token}`, payload);

export const fetchAllBusinesses = () => makeRequest("get", `/api/businesses`);

export const login = (payload: { email: string; password: string }) =>
  makeRequest("post", `/api/users/login`, payload, false); // login doesn't need auth

export const contactUs = (payload: contactUsProps) =>
  makeRequest("post", `/api/users/contact-us`, payload, false);

export const askAQuestion = (payload: { userQuestion: string }) =>
  makeRequest("post", `/api/users/ask-question`, payload);

export const changePassword = (payload: {
  currentPassword: string;
  newPassword: string;
}) => makeRequest("post", `/api/users/changePassword`, payload);

export const getQuestionDataByStream = (payload: { _id: string }) =>
  makeRequest("get", `/api/streams/questionnaire/${payload._id}`, payload);

export const submitQuestion = (payload: any) =>
  makeRequest("post", `/api/streams/submit-answers`, payload);

export const submitVideo = (payload: any) =>
  makeRequest("post", `/api/streams/mark-finished`, payload);

export const fetchAllStreams = (payload: { userId: string }) =>
  makeRequest("get", `/api/streams/streams-status/${payload.userId}`, payload);

export const fetchAllQuiz = () =>
  makeRequest("get", `/api/streams/random-waste-items`);

export const submitQuizAnswers = (payload: any) =>
  makeRequest("post", `/api/streams/submit-waste-item-answers`, payload);

export const registerGroupLeader = (payload: addGroupLeaderProps) =>
  makeRequest("post", `/api/users/register/group-leader`, payload);

export const updateGroupLeader = (payload: updateGroupLeaderProps) =>
  makeRequest("put", `/api/admins/group-leader/update`, payload);

export const bulkDeleteGroupLeaders = (payload: any) =>
  makeRequest("put", `/api/admins/users/bulk-delete`, payload);

export const bulkResetPWGroupLeaders = (payload: any) =>
  makeRequest("post", `/api/admins/bulkSendNewPasswords`, payload);

export const bulkDeleteAdmin = (payload: any) =>
  makeRequest("put", `/api/admins/users/bulk-delete`, payload);

export const bulkResetPWAdmin = (payload: any) =>
  makeRequest("post", `/api/admins/bulkSendNewPasswords`, payload);

export const bulkDeleteUsers = (payload: any) =>
  makeRequest("put", `/api/group-leaders/normal-users/bulk-delete`, payload);

export const bulkResetPWUsers = (payload: any) =>
  makeRequest(
    "post",
    `/api/group-leaders/bulkSendNewPasswordsToNormalUsers`,
    payload
  );

export const fetchAllGroupLeaders = (payload: fetchUsesProps) =>
  makeRequest(
    "get",
    `/api/admins/group-leaders?page=${payload.page}&limit=${limit}&sortColumn=${payload.sortColumn}&sortDirection=${payload.sortDirection}`
  );

export const fetchAllAdmin = (payload: fetchAdminProps) =>
  makeRequest(
    "get",
    `/api/admins/admins?sortColumn=${payload.sortColumn}&sortDirection=${payload.sortDirection}`
  );

export const fetchAllUsers = (payload: fetchUsesProps) =>
  makeRequest(
    "get",
    `api/group-leaders/normal-users?page=${payload.page}&limit=${limit}&sortColumn=${payload.sortColumn}&sortDirection=${payload.sortDirection}`
  );

export const registerAdmin = (payload: addUserProps) =>
  makeRequest("post", `/api/users/register/admin`, payload);

export const registerUser = (payload: addUserProps) =>
  makeRequest("post", `/api/users/register/normal-user`, payload);

export const updateUser = (payload: updateUserProps) =>
  makeRequest("put", `/api/group-leaders/normal-user/update`, payload);

export const bulkAddNormalUsers = (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  return makeRequest("post", `/api/group-leaders/bulk-create-users`, formData);
};

export const fetchSelfDetail = () =>
  makeRequest("get", `/api/users/user-details`);

export const updateSelfDetail = (payload: updateSelfDetailProps) =>
  makeRequest("put", `/api/users/update-personal-info`, payload);
