// pages/api/quiz/[stream].js

import { NextApiHandler } from "next";
import { QuestionData } from "../../../ultility/interfaces";

const quizData: QuestionData = {
  stream1: [
    {
      id: "1",
      question: "Question 1 in Category 1",
      options: [
        { id: "a", text: "Paris" },
        { id: "b", text: "London" },
        { id: "c", text: "Berlin" },
        { id: "d", text: "Madrid" },
      ],
      correctAnswer: "a",
    },
    {
      id: "2",
      question: "Question 1 in Category 1",
      options: [
        { id: "a", text: "Paris" },
        { id: "b", text: "London" },
        { id: "c", text: "Berlin" },
      ],
      correctAnswer: "a",
    },
    // Add more questions for stream1
  ],
  stream2: [
    {
      id: "2",
      question: "Which planet is known as the Red Planet?",
      options: [
        { id: "a", text: "Earth" },
        { id: "b", text: "Mars" },
        { id: "c", text: "Venus" },
        { id: "d", text: "Jupiter" },
      ],
      correctAnswer: "b",
    },
    // Add more questions for stream2
  ],
  // Define other categories and their quiz questions
};

const findQuizByCategory = (streamId: string) => {
  return quizData[streamId] || [];
};

const handler: NextApiHandler = (req, res) => {
  if (req.method === "GET") {
    const { streamId } = req.query;
    if (!streamId) {
      return res.status(400).json({ error: "streamId parameter is required" });
    }
    // Convert quizId to a string if it's an array
    const normalizedQuizId = Array.isArray(streamId) ? streamId[0] : streamId;

    const quiz = findQuizByCategory(normalizedQuizId);

    res.status(200).json(quiz);
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
};

export default handler;
