import React, { useEffect, useState } from 'react';
import Layout from '../../src/components/Layout';
import { Container, Row, Col, Button } from "react-bootstrap";
import utilStyles from '../../src/styles/utils.module.scss';
import pageStyles from '../../src/styles/page.module.scss';
import { fetchAllStreamsSlice } from "../../store/questionSlice";
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../store';
import Link from "next/link";
import { useRouter } from 'next/router';

function TraininPage() {
  const { allStreams, fetchQuestionLoading } = useSelector((state: RootState) => state.question);
  const [showQuziBtn, setShowQuziBtn] = useState(true);
  const [userInfo, setuserInfo] = useState('');
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const parseUserInfo = JSON.parse(userInfo);
      const payload = {
        userId: parseUserInfo.id,
      }
      dispatch(fetchAllStreamsSlice(payload))
      setuserInfo(userInfo)
    }
  }, [])

  useEffect(() => {
    if (allStreams && allStreams.length > 0) {
      setShowQuziBtn(allStreams.every((element: any) => element.status === "completed"));
    }
  }, [allStreams])


  const getIcon = (stream: string) => {
    let imgUrl = "/images/stream-icons1.png";
    switch (stream) {
      case "stream2":
        imgUrl = "/images/stream-icons2.png";
        break;
      case "stream3":
        imgUrl = "/images/stream-icons3.png";
        break;
      case "stream4":
        imgUrl = "/images/stream-icons4.png";
        break;
      case "stream5":
        imgUrl = "/images/stream-icons5.png";
        break;
      case "stream6":
        imgUrl = "/images/stream-icons6.png";
        break;

      default:
        imgUrl = "/images/stream-icons1.png";
    }
    return imgUrl;
  }

  const handleNavToQuiz = () => {
    router.push('/quiz')
  }
  return (

    <Layout loading={fetchQuestionLoading}>
      <div className="page-section grey">
        {
          userInfo && (
            <Container>
              <h3 className={utilStyles.sectionTitleCenter}>Training</h3>
              <div className={utilStyles.sectionSubTitle}>
                <div>
                  Click on the stream you would like to watch.
                </div>
                <div>
                  Streams you have already completed are indicated with a tick.
                </div>
                <div>
                  All streams must be completed before you can continue on to the assessment.
                </div>
              </div>

              {
                showQuziBtn && (
                  <div className={pageStyles.quziBtnContainer} >

                    <Button onClick={handleNavToQuiz}>Continue to Final Sorting Task</Button>
                  </div>
                )
              }

              <Row className={utilStyles.SmRow}>
                {allStreams && allStreams.map((item: any, index: any) => (
                  <Col xs="12" md="4" className="mb-4 stream-icon-box" key={index} >
                    <Link href={`/training/${item.streamName}`} >
                      <div className={`stream-icon ${item.streamName}`}>
                        <div className={item.status == "completed" ? "tick" : ""}></div>
                        {/* <div>
                      <Image src={getIcon(item.streamName)} alt="logo" width={100} height={50} />
                    </div> */}
                        <div className='stream-title'>{item.streamTitle}</div>
                        {/* <Button>Start Training</Button> */}
                      </div>
                    </Link>
                  </Col>))}
              </Row>
            </Container>
          )
        }
      </div>
    </Layout>
  )
}

export default TraininPage;
