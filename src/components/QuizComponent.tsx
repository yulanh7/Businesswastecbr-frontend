import React, { useState } from 'react';
import { useAppDispatch } from '../../store';
import { Row, Col, Image, Form, Button, Alert } from 'react-bootstrap';
import {
  incrementQuizIndex,
  decrementQuizIndex,
  submitQuizAnswersSlice,
} from '../../store/quizSlice';
import {
  getUserScoreSlice
} from '../../store/quizSlice';
import pageStyles from '../styles/page.module.scss'
import { renderImg, OPTIONS } from "../../ultility/ultility";


interface SelectedAnswers {
  [quizId: string]: string;
}

interface QuizItem {
  _id: string; // Ensure it's a string
  itemName: string;
}

interface QuizProps {
  allQuiz: QuizItem[];
  currentQuizIndex: number;
  highestScore: number;
  submitQuizMessage: any;
  submitQuizError: any;
  currentQuizScore?: any;
  userAnswerResponse?: any;
  handleTryAgain: () => void;
  handleShowModal: () => void;
}



const QuizComponent = ({ allQuiz, currentQuizIndex, submitQuizMessage, submitQuizError, currentQuizScore, userAnswerResponse }: QuizProps) => {
  const dispatch = useAppDispatch();
  const [selectedAnswers, setSelectedAnswers] = useState<SelectedAnswers>({});
  const [optionSelected, setOptionSelected] = useState(false);
  const handleOptionSelect = (quizId: string, selectedOption: string, event: React.MouseEvent<HTMLInputElement>) => {
    event.preventDefault(); // Prevent form submission and page reload
    setSelectedAnswers((prevAnswers) => ({
      ...prevAnswers,
      [quizId]: selectedOption,
    }));

    if (currentQuizIndex < allQuiz.length - 1) {
      handleNext();
    } else {
      setOptionSelected(true);
    }
  };


  const currentQuestion = allQuiz[currentQuizIndex];

  const handleNext = () => {
    dispatch(incrementQuizIndex());
  };

  const handlePrevious = () => {
    setOptionSelected(false);
    dispatch(decrementQuizIndex());
  };

  const handleSubmit = async () => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const parseUserInfo = JSON.parse(userInfo);
      const answersArray = Object.keys(selectedAnswers).map(itemId => {
        return {
          itemId: itemId,
          bin: selectedAnswers[itemId]
        };
      });

      const payload = {
        userId: parseUserInfo.id,
        answers: answersArray
      }
      await dispatch(submitQuizAnswersSlice(payload));
      dispatch(getUserScoreSlice(payload));
      setSelectedAnswers({});
    }
  };

  return (
    <div>
      {
        !userAnswerResponse && ((currentQuizScore !== null && currentQuizScore < 100) || !currentQuizScore) && (
          <>
            {currentQuestion && (
              <Row key={currentQuestion._id}>
                <Col xs={4} className={`${pageStyles.questionImgContainer} padding10px`} >
                  <h6 className={pageStyles.itemName}>{currentQuestion.itemName}</h6>
                  <Image
                    src={renderImg(currentQuestion.itemName) || undefined}
                    alt={currentQuestion.itemName}
                    width="80%"
                  />
                </Col>
                <Col xs={8}>
                  <Form>
                    <Row>
                      {OPTIONS.map(option => (
                        <Col xs={6} sm={4} key={option.bin} className='padding10px'>
                          <label className={selectedAnswers[currentQuestion._id] === option.bin ? 'selected' : ''}>
                            <input
                              type="image"
                              name={currentQuestion._id}
                              src={option.img} // Change the extension if needed
                              alt={option.bin}
                              width={50} // Adjust the image width as needed
                              height={50} // Adjust the image height as needed
                              onClick={(event) => handleOptionSelect(currentQuestion._id, option.bin, event)}
                            />
                          </label>
                        </Col>
                      ))}
                    </Row>
                  </Form>
                </Col>
              </Row>
            )}
            {submitQuizError && (
              <div className="error-message">{submitQuizError}</div>
            )}
            {submitQuizMessage && (
              <div className="success-message">{submitQuizMessage}</div>
            )}
            <div className="navigation-buttons">
              <Button
                variant="primary"
                disabled={currentQuizIndex === 0}
                onClick={handlePrevious}
              >
                Previous
              </Button>
              {currentQuizIndex < allQuiz.length - 1 && selectedAnswers[currentQuestion._id] && (
                <Button
                  variant="primary"
                  onClick={handleNext}
                >
                  Next
                </Button>
              )}
              {currentQuizIndex === allQuiz.length - 1 && (optionSelected || selectedAnswers[currentQuestion._id]) && (
                <Button
                  variant="success"
                  onClick={handleSubmit}
                >
                  Submit
                </Button>
              )}
            </div>


          </>
        )
      }


    </div>
  );
};

export default QuizComponent;
