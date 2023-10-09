import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import ProgressBar from '../src/components/ProgressBar';
import QuizComponent from '../src/components/QuizComponent';
import { getQuizSlice, resetQuizPage } from '../store/quizSlice';
import { getUserScoreSlice, setCurrentQuizScoreSlice } from '../store/quizSlice';
import { RootState, useAppDispatch } from '../store';
import Layout from "../src/components/Layout";
import { Container, Button, Card, Table, Image } from 'react-bootstrap';
import utilStyles from '../src/styles/utils.module.scss'
import pageStyles from '../src/styles/page.module.scss'
import downloadPdf from '../ultility/downloadPdf';
import Link from 'next/link';
import AskAQuestion from "../src/components/AskAQuestion";
import { getUserInfo } from '../ultility/ultility';
import { renderImg } from "../ultility/ultility";
import Banner from "../src/components/Banner";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';


const QuizPage = () => {
  const dispatch = useAppDispatch();
  const {
    allQuiz,
    currentQuizIndex,
    submitQuizError,
    submitQuizMessage,
    userAnswerResponse,
    quizScore: { highestScore },
    currentQuizScore,
    fetchQuizLoading
  } = useSelector((state: RootState) => state.quiz);
  const [showModal, setShowModal] = useState(false);

  const handleShowModal = () => {
    setShowModal(true)
  };
  const handleCloseModal = () => setShowModal(false);



  useEffect(() => {
    dispatch(getQuizSlice());
    const userInfo = getUserInfo();
    if (userInfo) {
      dispatch(getUserScoreSlice({ userId: userInfo.id }));
      dispatch(setCurrentQuizScoreSlice({ userId: userInfo.id }));
    }
  }, [dispatch]);

  const handleTryAgain = () => {
    dispatch(resetQuizPage());
  }
  return (
    <Layout loading={fetchQuizLoading}>
      {allQuiz && allQuiz.length > 0 && ((currentQuizScore !== null && currentQuizScore < 90) || !currentQuizScore) && !userAnswerResponse && (
        <Banner screen="lg">
          <p>
            Click on the correct bin for disposal of the displayed item
          </p>
        </Banner>
      )}
      <Container className={pageStyles.quizPageSection1}>
        {currentQuizScore !== null && currentQuizScore >= 90 && !userAnswerResponse && (
          <Card className={pageStyles.responseQuizCard}>
            <p>
              <b>Your Score:</b> {parseInt(currentQuizScore)}
            </p>
            <h5>Congratulations. You have successfully completed the Sustainable Business Program recycling training.
            </h5>
            <Button onClick={handleTryAgain}>Try Again</Button>

          </Card>
        )}

        {allQuiz && allQuiz.length > 0 && ((currentQuizScore !== null && currentQuizScore < 90) || !currentQuizScore) && (
          <>
            {!userAnswerResponse && (
              <ProgressBar currentQuizIndex={currentQuizIndex} totalQuiz={allQuiz.length} />
            )}
            <QuizComponent
              allQuiz={allQuiz}
              currentQuizIndex={currentQuizIndex}
              submitQuizMessage={submitQuizMessage}
              submitQuizError={submitQuizError}
              highestScore={highestScore}
              currentQuizScore={currentQuizScore}
              userAnswerResponse={userAnswerResponse}
              handleTryAgain={handleTryAgain}
              handleShowModal={handleShowModal}
            />
          </>
        )}
      </Container>


      {userAnswerResponse && currentQuizScore !== null && (
        <Container className={pageStyles.userScoreDetail}>
          <Card className={pageStyles.responseQuizCard}>
            <p><b>Your Best Score:</b> {highestScore}%</p>
            <p><b>Your Score:</b> {parseInt(currentQuizScore)}%</p>
            {currentQuizScore < 90 && (
              <h5>Sorry. You did not pass the quiz this time. Scroll down to see your answers and the correct answers. Then try again.</h5>
            )}

            {currentQuizScore >= 90 && currentQuizScore < 100 && (
              <h5>Congratulations. You have successfully completed the Sustainable Business Program recycling training.
                Scroll down to see your answers and the correct answers</h5>
            )}
            {currentQuizScore == 100 && (
              <h5>Congratulations. You have successfully completed the Sustainable Business Program recycling training.
              </h5>
            )}
            <div className={utilStyles.actionContainer}>
              <Button onClick={handleTryAgain} className={utilStyles.mR10px}>Try Again</Button>
              <Button onClick={handleShowModal}>Ask A Question</Button>
            </div>
          </Card>
        </Container>
      )}

      {userAnswerResponse && currentQuizScore < 100 && (
        <div className={`${pageStyles.quizPageSection2} ${pageStyles.quizPageSection}`}>
          <Container>
            <h4 className={utilStyles.sectionTitleCenter}>
              Your Answer List
            </h4>
            <Table className={pageStyles.answerTable}>
              <thead>
                <tr>
                  <th>Waste Item</th>
                  <th>Your Answer</th>
                  <th>Correct Answer</th>
                </tr>
              </thead>
              <tbody>
                {userAnswerResponse.details.map((item: any, index: number) => (
                  <tr key={index}>
                    <td>
                      <h6 className={pageStyles.itemName}>{item.itemName}</h6>
                      <Image
                        src={renderImg(item.itemName) || undefined}
                        alt={item.itemName}
                      />
                    </td>
                    <td>
                      <div className={pageStyles.tdInner}>

                        <Image
                          src={renderImg(item.userAnswer) || undefined}
                          alt={item.userAnswer}
                        />
                        {
                          item.isCorrect ?
                            <FontAwesomeIcon icon={faCheck} className={pageStyles.correctMark} /> :
                            <FontAwesomeIcon icon={faTimes} className={pageStyles.wrongMark} />
                        }
                      </div>

                    </td>
                    <td className={pageStyles.correctCol}>
                      <div className={pageStyles.tdInner}>

                        {
                          item.isCorrect && item.alternativeAnswer &&
                          <>
                            {
                              item.userAnswer == item.correctAnswer ?
                                <div className={pageStyles.correctColBox}>
                                  <div className={pageStyles.correctText}>
                                    Also correct
                                  </div>
                                  <Image
                                    src={renderImg(item.alternativeAnswer) || undefined}
                                    alt={item.alternativeAnswer}
                                  />

                                </div> :
                                <div className={pageStyles.correctColBox}>
                                  <div className={pageStyles.correctText}>
                                    Also correct
                                  </div>
                                  <Image
                                    src={renderImg(item.correctAnswer) || undefined}
                                    alt={item.alternativeAnswer}
                                  />


                                </div>
                            }
                          </>
                        }



                        {
                          !item.isCorrect &&
                          <div>

                            <Image
                              src={renderImg(item.correctAnswer) || undefined}
                              alt={item.correctAnswer}
                            />
                            {item.alternativeAnswer &&
                              <Image
                                src={renderImg(item.alternativeAnswer) || undefined}
                                alt={item.alternativeAnswer}
                                className={pageStyles.alternativeAnswer}
                              />
                            }
                          </div>
                        }
                      </div>

                    </td>

                  </tr>
                ))}
              </tbody>
            </Table>
            <div className={utilStyles.textCenter}>

              <Button onClick={handleTryAgain}>Try Again</Button>
            </div>

          </Container>
        </div>
      )}
      <AskAQuestion show={showModal} onHide={handleCloseModal} />
    </Layout>
  );
};

export default QuizPage;
