export interface UserData {
  businessName: string;
  businessType: string;
  firstName: string;
  lastName: string;
  email: string;
  userType: string;
}

export interface QuestionItem {
  id: string;
  question: string;
  options: { id: string; text: string }[];
  correctAnswer: string;
}

export interface QuestionData {
  [stream: string]: QuestionItem[];
}

export interface QuizItem {
  _id: string;
  name: string;
  image: string;
  options: { id: string; img: string }[];
  correctAnswer: string;
  isFinished: boolean;
  isCorrect: boolean;
}

export interface QuizData {
  [stream: string]: QuizItem[];
}

export interface fetchAdminProps {
  // page: any;
  sortColumn?: any;
  sortDirection?: any;
  // limit: number;
}

export interface fetchUsesProps {
  page: any;
  businessId?: any;
  sortColumn?: any;
  sortDirection?: any;
  // limit: number;
}

export interface addGroupLeaderProps {
  firstName: string;
  lastName: string;
  email: string;
  userType: string;
  businessId?: string | null;
  businessDetails?: {
    businessName: string;
    businessType: string;
  };
}
export interface updateGroupLeaderProps {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  // businessName: string;
}

export interface addUserProps {
  firstName: string;
  lastName: string;
  // phone: string;
  email: string;
  userType: string;
}
export interface updateUserProps {
  userId: string;
  businessId?: string;
  firstName: string;
  lastName: string;
  // phone: string;
  email: string;
}
export interface updateSelfDetailProps {
  firstName: string;
  lastName: string;
  // email: string;
}
export interface contactUsProps {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

export const defaultUsersObject = {
  pageIdx: 0,
  pageSize: 0,
  totalRecord: 0,
  records: [],
};
