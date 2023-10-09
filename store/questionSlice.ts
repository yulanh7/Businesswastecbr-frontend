import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk } from "./types";
import {
  getQuestionDataByStream,
  submitQuestion,
  submitVideo,
  fetchAllStreams,
} from "../api/api";

interface QuestionData {
  fetchQuestionLoading: boolean;
  submitQuestionLoading: boolean;
  allStreams: any;
  questionByStream: any; // Replace any with the actual type for user
  fetchQuestionError: string | null;
  fetchQuestionMessage: string | null;
  submitQuestionError: string | null;
  submitQuestionMessage: string | null;
  answerIsCorrect: boolean;
}

const initialState: QuestionData = {
  questionByStream: null,
  allStreams: null,
  fetchQuestionLoading: false,
  submitQuestionLoading: false,
  fetchQuestionError: null,
  fetchQuestionMessage: null,
  submitQuestionError: null,
  submitQuestionMessage: null,
  answerIsCorrect: false,
};

const questionSlice = createSlice({
  name: "question",
  initialState,
  reducers: {
    resetQuestionMessage: (state) => {
      state.fetchQuestionError = null;
      state.fetchQuestionMessage = null;
      state.submitQuestionError = null;
      state.submitQuestionMessage = null;
    },
    fetchQuestionStart: (state) => {
      state.fetchQuestionLoading = true;
      state.fetchQuestionError = null;
      state.fetchQuestionMessage = null;
    },
    fetchQuestionSuccess: (
      state,
      action: PayloadAction<{ type: string; data: any }>
    ) => {
      state.fetchQuestionLoading = false;
      state.fetchQuestionMessage = "Fetch successfully";
      if (action.payload.type === "streams") {
        state.allStreams = action.payload.data;
      } else {
        state.questionByStream = action.payload.data;
      }
    },
    fetchQuestionFailure: (state, action: PayloadAction<any>) => {
      state.fetchQuestionLoading = false;
      state.fetchQuestionMessage = null;
      state.fetchQuestionError = action.payload;
    },
    submitQuestionStart: (state) => {
      state.submitQuestionLoading = true;
      state.submitQuestionError = null;
      state.submitQuestionMessage = null;
      state.answerIsCorrect = false;
    },
    submitQuestionSuccess: (state, action: PayloadAction<any>) => {
      state.submitQuestionLoading = false;
      state.submitQuestionMessage = action.payload;
      state.submitQuestionError = null;
      state.answerIsCorrect = true;
    },
    submitQuestionFailure: (state, action: PayloadAction<any>) => {
      state.submitQuestionLoading = false;
      state.submitQuestionMessage = null;
      state.submitQuestionError = action.payload;
      state.answerIsCorrect = false;
    },
  },
});

export const {
  resetQuestionMessage,
  fetchQuestionStart,
  fetchQuestionSuccess,
  fetchQuestionFailure,
  submitQuestionStart,
  submitQuestionSuccess,
  submitQuestionFailure,
} = questionSlice.actions;
export default questionSlice.reducer;

export const getQuestionByStreamSlice =
  (payload: { _id: string }): AppThunk<Promise<void>> =>
  async (dispatch) => {
    try {
      dispatch(fetchQuestionStart());
      const questionByStream = await getQuestionDataByStream(payload);
      dispatch(
        fetchQuestionSuccess({ type: "question", data: questionByStream })
      );
    } catch (error) {
      dispatch(fetchQuestionFailure((error as Error).message));
    }
  };

export const fetchAllStreamsSlice =
  (payload: { userId: string }): AppThunk<Promise<void>> =>
  async (dispatch) => {
    try {
      dispatch(fetchQuestionStart());
      const allStreams = await fetchAllStreams(payload);
      dispatch(fetchQuestionSuccess({ type: "streams", data: allStreams }));
    } catch (error) {
      dispatch(fetchQuestionFailure((error as Error).message));
    }
  };

export const submitQuestionSlice =
  (payload: any): AppThunk<Promise<void>> =>
  async (dispatch) => {
    try {
      dispatch(submitQuestionStart());
      const response = await submitQuestion(payload);
      dispatch(submitQuestionSuccess(response));
    } catch (error) {
      dispatch(submitQuestionFailure(error));
    }
  };

export const submitVideoSlice =
  (payload: any): AppThunk<Promise<void>> =>
  async (dispatch) => {
    try {
      dispatch(submitQuestionStart());
      const response = await submitVideo(payload);
      dispatch(submitQuestionSuccess(response));
    } catch (error) {
      dispatch(submitQuestionFailure(error));
    }
  };
