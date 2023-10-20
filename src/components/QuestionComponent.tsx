import React, { useState, useCallback } from 'react';
import { Card, Form, Button } from 'react-bootstrap';
import { useAppDispatch } from '../../store';
import { submitQuestionSlice, resetQuestionMessage } from "../../store/questionSlice";
import utilStyles from '../styles/utils.module.scss';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';

const defaultMessage = {
  text: null,
  isError: false,
};

interface SelectedAnswers {
  [questionId: string]: string[];
}

interface QuestionItem {
  _id: string,
  questionText: string,
  options: string[],
  correctAnswers: string[],
  type: "single" | "multiple"
}

interface QuestionProps {
  question: {
    hasQuestionnaire: boolean,
    questionnaire: QuestionItem[];
  }
  fetchQuestionLoading: boolean;
  submitQuestionLoading: boolean;
  answerIsCorrect: boolean;
  streamId: string;
  message?: any;
  error?: any;
  stream: string;
  currentStream: any;
  handleHideQuestion: () => void;
  handleHideQuestionBtn: () => void;
}


const Question: React.FC<QuestionProps> = ({
  question, fetchQuestionLoading, submitQuestionLoading, streamId, message, error, stream, answerIsCorrect, handleHideQuestion, currentStream, handleHideQuestionBtn
}) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [selectedAnswers, setSelectedAnswers] = useState<SelectedAnswers>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [evaluation, setEvaluation] = useState({});
  const [showTryAgain, setShowTryAgain] = useState(false);


  const handleOptionSelect = useCallback((questionId: string, selectedOption: string, type: "single" | "multiple") => {
    if (type === "single") {
      setSelectedAnswers(prev => ({
        ...prev,
        [questionId]: [selectedOption]
      }));
    } else {
      setSelectedAnswers(prev => ({
        ...prev,
        [questionId]: prev[questionId]
          ? prev[questionId].includes(selectedOption)
            ? prev[questionId].filter(option => option !== selectedOption)
            : [...prev[questionId], selectedOption]
          : [selectedOption]
      }));
    }
    setShowTryAgain(false); // Add this line to hide the "Try Again" button and show the "Submit" button when an option is clicked
    setIsSubmitted(false); // Add this line to hide the "Try Again" button and show the "Submit" button when an option is clicked
  }, []);



  const handleAnswerSubmit = useCallback(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    if (userInfo) {
      const payload = {
        streamId,
        answers: Object.entries(selectedAnswers).map(([questionId, answer]) => ({ questionId, answer })),
        userId: userInfo.id,
      }
      dispatch(submitQuestionSlice(payload));

      // Evaluate answers
      const evalObj: any = {};
      question.questionnaire.forEach(q => {
        evalObj[q._id] = q.correctAnswers;
      });
      setEvaluation(evalObj);
      setIsSubmitted(true);
      setShowTryAgain(true);
    }
  }, [dispatch, streamId, selectedAnswers, question]);

  const handleTryAgain = useCallback(() => {
    setSelectedAnswers({});
    setIsSubmitted(false);
    setShowTryAgain(false);
    dispatch(resetQuestionMessage());

  }, []);

  const handleNavigation = useCallback((path: string) => {
    router.push(path);
    handleHideQuestion();
    handleHideQuestionBtn();
    dispatch(resetQuestionMessage());
  }, [router, handleHideQuestion, handleHideQuestionBtn, dispatch]);
  console.log(selectedAnswers);
  return (
    <div className='stream-question-container'>
      {fetchQuestionLoading && (
        <div>Loading</div>
      )}
      {question && question.questionnaire && !fetchQuestionLoading && (
        question.questionnaire.map((question: QuestionItem) => (
          <Card key={question._id} className="my-3">
            <Card.Body>
              <Card.Title>{question.questionText}</Card.Title>
              <Form>
                {question.options.map((option) => (
                  <>
                    <Form.Check
                      disabled={isSubmitted}
                      key={option}
                      type={question.type === "single" ? "radio" : "checkbox"}
                      name={`question_${question._id}`}
                      label={option}
                      checked={
                        selectedAnswers[question._id]
                          ? selectedAnswers[question._id].includes(option)
                          : false
                      }
                      onChange={() => handleOptionSelect(question._id, option, question.type)}
                      style={isSubmitted ? {
                        color: question.correctAnswers.includes(option) ? 'green' : ''
                      } : {}}
                    />


                  </>

                ))}
              </Form>
              {isSubmitted && !answerIsCorrect ?
                (selectedAnswers[question._id] && selectedAnswers[question._id].every(ans => question.correctAnswers.includes(ans))
                  && question.correctAnswers.every(correctAns => selectedAnswers[question._id].includes(correctAns))
                  ? <FontAwesomeIcon icon={faCheck} className='answer-icon correct-icon-big' /> : <FontAwesomeIcon icon={faTimes} className='answer-icon wrong-icon-big' />
                ) : ''
              }

            </Card.Body>
          </Card>
        ))
      )}
      {message &&
        <FontAwesomeIcon icon={faCheck} className='correct-icon-xlg' />
      }
      {message && answerIsCorrect && (
        <div className="success-message">
          Well done. This stream is complete
        </div>
      )}
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      <div className={utilStyles.actionContainer}>
        {!showTryAgain && (
          <Button
            onClick={handleAnswerSubmit}
            className={utilStyles.mT10px}
            id="question-submit"
            disabled={submitQuestionLoading}
          >
            {submitQuestionLoading ? "Submitting..." : "Submit Answers"}
          </Button>
        )}
        {showTryAgain && !answerIsCorrect && (
          <Button
            onClick={handleTryAgain}
            className={utilStyles.mT10px}
            id="try-again-button"
          >
            Try Again
          </Button>
        )}

        <div className={utilStyles.preNextAction}>
          {stream !== 'stream1' &&
            <Button onClick={() => handleNavigation(currentStream.prev)} className={utilStyles.mT10px}>
              {`<Previous`}
            </Button>
          }
          {message &&
            <Button
              onClick={() => handleNavigation(currentStream.next)} className={utilStyles.mT10px}
            >
              {stream === "stream6" ? "Finish" : "Next>"}
            </Button>
          }
        </div>
      </div>

    </div>
  );
};

export default Question;
