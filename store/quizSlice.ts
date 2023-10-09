import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk } from "./types";
import { submitQuizAnswers, fetchAllQuiz, getUserScore } from "../api/api";

interface QuizItem {
  _id: string; // Ensure it's a string
  name: string;
  image: string;
  options: Array<{ id: string; img: string }>;
  correctAnswer: string;
}
interface QuizScoreProps {
  highestScore: any; // Ensure it's a string
  name: string;
  scoreAchievementTime: string;
}

const defaultQuizScore = {
  highestScore: null,
  name: "",
  scoreAchievementTime: "",
};

interface QuizData {
  quizLoading: boolean;
  currentQuizIndex: number;
  userAnswerResponse: any;
  allQuiz: any;
  fetchQuizLoading: boolean;
  submitQuizLoading: boolean;
  fetchQuizError: string | null;
  fetchQuizMessage: string | null;
  submitQuizError: string | null;
  submitQuizMessage: string | null;
  quizScore: QuizScoreProps;
  currentQuizScore: any;
}

const initialState: QuizData = {
  currentQuizIndex: 0,
  userAnswerResponse: null,
  quizLoading: false,
  allQuiz: [],
  fetchQuizLoading: false,
  submitQuizLoading: false,
  fetchQuizError: null,
  fetchQuizMessage: null,
  submitQuizError: null,
  submitQuizMessage: null,
  quizScore: defaultQuizScore,
  currentQuizScore: null,
};

const useSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    resetQuizMessage: (state) => {
      state.fetchQuizError = null;
      state.fetchQuizMessage = null;
      state.submitQuizError = null;
      state.submitQuizMessage = null;
    },
    fetchQuizStart: (state) => {
      state.fetchQuizLoading = true;
      state.fetchQuizError = null;
      state.fetchQuizMessage = null;
    },
    fetchQuizSuccess: (
      state,
      action: PayloadAction<{ type: string; data: any }>
    ) => {
      state.fetchQuizLoading = false;
      state.fetchQuizMessage = "Fetch successfully";
    },
    fetchQuizFailure: (state, action: PayloadAction<any>) => {
      state.fetchQuizLoading = false;
      state.fetchQuizMessage = null;
      state.fetchQuizError = action.payload;
    },
    submitQuizStart: (state) => {
      state.submitQuizLoading = true;
      state.submitQuizError = null;
      state.submitQuizMessage = null;
    },
    submitQuizSuccess: (state, action: PayloadAction<any>) => {
      state.submitQuizLoading = false;
      state.submitQuizMessage = action.payload;
      state.submitQuizError = null;
    },
    submitQuizFailure: (state, action: PayloadAction<any>) => {
      state.submitQuizLoading = false;
      state.submitQuizMessage = null;
      state.submitQuizError = action.payload;
    },
    setCurrentQuizIndex: (state, action: PayloadAction<number>) => {
      state.currentQuizIndex = action.payload;
    },
    incrementQuizIndex: (state) => {
      if (state.currentQuizIndex < state.allQuiz.length - 1) {
        state.currentQuizIndex += 1;
      }
    },
    decrementQuizIndex: (state) => {
      if (state.currentQuizIndex > 0) {
        state.currentQuizIndex -= 1;
      }
    },
    resetQuizPage: (state) => {
      state.currentQuizIndex = 0;
      state.userAnswerResponse = null;
      state.currentQuizScore = null;
    },
    fetchUserScoreSuccess: (state, action: PayloadAction<any>) => {
      state.quizScore = action.payload;
    },
    setCurrentQuizScore: (state, action: PayloadAction<any>) => {
      state.currentQuizScore = action.payload;
    },
    fetchAllQuizSuccess: (state, action: PayloadAction<any>) => {
      state.allQuiz = action.payload;
    },
    submitQuizAnswersSuccess: (state, action: PayloadAction<any>) => {
      state.userAnswerResponse = action.payload;
      state.currentQuizIndex = 0;
    },
  },
});

export const {
  resetQuizMessage,
  fetchQuizStart,
  fetchQuizSuccess,
  fetchQuizFailure,
  submitQuizStart,
  submitQuizSuccess,
  submitQuizFailure,
  setCurrentQuizIndex,
  incrementQuizIndex,
  decrementQuizIndex,
  resetQuizPage,
  fetchAllQuizSuccess,
  submitQuizAnswersSuccess,
  fetchUserScoreSuccess,
  setCurrentQuizScore,
} = useSlice.actions;
export default useSlice.reducer;

export const getQuizSlice =
  (): AppThunk<Promise<void>> => // Add <Promise<void>> to specify the return type
  async (dispatch) => {
    try {
      const response = await fetchAllQuiz();
      dispatch(fetchAllQuizSuccess(response));
    } catch (error) {}
  };

export const getUserScoreSlice =
  (payload: {
    userId: string;
  }): AppThunk<Promise<void>> => // Add <Promise<void>> to specify the return type
  async (dispatch) => {
    try {
      const response = await getUserScore(payload);
      dispatch(fetchUserScoreSuccess(response));
    } catch (error) {}
  };
export const setCurrentQuizScoreSlice =
  (payload: {
    userId: string;
  }): AppThunk<Promise<void>> => // Add <Promise<void>> to specify the return type
  async (dispatch) => {
    try {
      const { highestScore } = await getUserScore(payload);
      dispatch(setCurrentQuizScore(highestScore));
    } catch (error) {}
  };

export const submitQuizAnswersSlice =
  (
    payload: any
  ): AppThunk<Promise<void>> => // Add <Promise<void>> to specify the return type
  async (dispatch) => {
    try {
      const response = await submitQuizAnswers(payload);
      dispatch(submitQuizAnswersSuccess(response));
      dispatch(setCurrentQuizScore(response.score));
    } catch (error) {}
  };
