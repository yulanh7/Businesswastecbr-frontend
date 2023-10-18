import React, { useState, useEffect, useCallback } from 'react';
import Layout from '../../src/components/Layout';
import QuestionComponent from '../../src/components/QuestionComponent';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { Container, Row, Button } from "react-bootstrap";
import utilStyles from '../../src/styles/utils.module.scss';
import { getQuestionByStreamSlice, submitVideoSlice, resetQuestionMessage } from "../../store/questionSlice";
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../store';
import { STREAMS, StreamType, scrollToSection } from "../../ultility/ultility";
import { GetServerSideProps } from 'next';

const DynamicReactPlayer = dynamic(() => import('../../src/components/VideoPlayer'), {
  ssr: false,
});

interface StreamPageProps {
  currentStream?: StreamType;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  if (!context.params) {
    return {
      notFound: true,
    };
  }

  const streamKey = context.params.stream;
  if (typeof streamKey !== 'string') {
    return {
      notFound: true,
    };
  }
  const currentStream = STREAMS[streamKey];

  // Here you can also fetch other data necessary for this page

  return {
    props: {
      currentStream,
    },
  };
}




const StreamPage: React.FC<StreamPageProps> = ({ currentStream }) => {
  const router = useRouter();
  const [videoLoading, setVideoLoading] = useState(true);
  const [playing, setPlaying] = useState(true);
  const [hasStarted, setHasStarted] = useState(false); // Initially set to false

  const streamKey = Array.isArray(router.query.stream) ? router.query.stream[0] : router.query.stream;
  const [showQuestion, setShowQuestion] = useState(false);
  const [showQuestionBtn, setShowQuestionBtn] = useState(false);
  const { questionByStream, fetchQuestionLoading, submitQuestionMessage, submitQuestionError, submitQuestionLoading, answerIsCorrect

  } = useSelector((state: RootState) => state.question);
  const dispatch = useAppDispatch();

  useEffect(() => {
    currentStream && dispatch(getQuestionByStreamSlice({ _id: currentStream.id }));
  }, [dispatch, currentStream]);

  const handleVideoFinish = useCallback(() => {

    setShowQuestionBtn(true);
    if (questionByStream && questionByStream.hasQuestionnaire) {
      scrollToSection("stream-section");
    }
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    if (userInfo && !questionByStream.hasQuestionnaire && currentStream) {
      dispatch(submitVideoSlice({ streamId: currentStream.id, userId: userInfo.id }));
    }
  }, [dispatch, currentStream, questionByStream]);

  const handleShowQuestion = async () => {
    await setShowQuestion(true);
    scrollToSection("question-section");
  };

  const handleNavigation = useCallback((path: any) => {
    router.push(path);
    setShowQuestion(false);
    setShowQuestionBtn(false);
    dispatch(resetQuestionMessage());
  }, [router, dispatch]);

  useEffect(() => {
    setPlaying(true);
    setHasStarted(false);
  }, [currentStream]);


  return (
    <Layout loading={fetchQuestionLoading || videoLoading}>
      <Container className="page-section" id="stream-section">
        <Row className={`${utilStyles.SmRow} ${utilStyles.flexCenter}`}>
          <h4 className={`${utilStyles.textCenter} ${utilStyles.pB20px}`}>{currentStream?.title}</h4>
          {showQuestionBtn && questionByStream && questionByStream.hasQuestionnaire && !showQuestion && (
            <Button onClick={handleShowQuestion} className={utilStyles.questionBtn}>Answer Questions </Button>
          )}


          <DynamicReactPlayer
            videoUrl={`/videos/${currentStream?.videoUrl}.mp4`}
            imageSrc={`/images/stream/${currentStream?.imageSrc}.jpg`}
            altText="Video Cover"
            loading={videoLoading}
            setVideoLoading={setVideoLoading}
            onVideoFinish={handleVideoFinish}
            playing={playing}
            setPlaying={setPlaying}
            hasStarted={hasStarted}
            setHasStarted={setHasStarted}
          />

          {showQuestionBtn && questionByStream && !questionByStream.hasQuestionnaire && (
            <div className={utilStyles.smContainer}>
              {submitQuestionMessage && (
                <div className="success-message">
                  {submitQuestionMessage}
                </div>
              )}
              {submitQuestionError && (
                <div className="error-message">
                  {submitQuestionError}
                </div>
              )}
              <div className={utilStyles.preNextAction}>
                {currentStream && currentStream.prev && (
                  <Button onClick={() => handleNavigation(currentStream.prev)} className={utilStyles.mT10px}>&lt;Pre</Button>
                )}
                {currentStream && currentStream.next && submitQuestionMessage && (
                  <Button onClick={() => handleNavigation(currentStream.next)} className={utilStyles.mT10px}>
                    {streamKey === "stream6" ? "Finish" : "Next>"}
                  </Button>
                )}
              </div>
            </div>
          )}

          <div id='question-section'>
            {showQuestionBtn && showQuestion && currentStream && currentStream.id && streamKey && (
              <QuestionComponent
                question={questionByStream}
                fetchQuestionLoading={fetchQuestionLoading}
                submitQuestionLoading={submitQuestionLoading}
                streamId={currentStream.id}
                message={submitQuestionMessage}
                error={submitQuestionError}
                stream={streamKey}
                currentStream={currentStream}
                handleHideQuestion={() => setShowQuestion(false)}
                handleHideQuestionBtn={() => setShowQuestionBtn(false)}
                answerIsCorrect={answerIsCorrect}
              />
            )}
          </div>
        </Row>
      </Container>
    </Layout>
  );
};

export default StreamPage;
