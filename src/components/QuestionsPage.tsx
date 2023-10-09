import React from 'react';
import { Container, Row, Col } from "react-bootstrap";
import dynamic from 'next/dynamic';
import utilStyles from '../styles/utils.module.scss';

interface streamComponentProps {
  stream: string;
  className: string;
  text: string
}

const streamArray = [
  {
    stream: "stream1",
    className: "scheme-blue",
    text: "Paper and Cardboard",
  },
  {
    stream: "stream2",
    className: "scheme-red",
    text: "Organic Material",
  },
  {
    stream: "stream3",
    className: "scheme-yellow",
    text: "Mixed Recyclables",
  },
  {
    stream: "stream4",
    className: "scheme-green",
    text: "Waste to Landfill",
  },
  {
    stream: "stream5",
    className: "scheme-purple",
    text: "Batteries",
  },
  {
    stream: "stream6",
    className: "scheme-grey",
    text: "Printer Cartridges",
  },
]

const StreamComponent: React.FC<streamComponentProps> = ({ stream, className, text }) => (
  <Col xs="12" md="4" className="mb-4">
    <a href={`/training/${stream}`} target='_blank'>
      <div className={`stream-icon ${className}`}>
        <div className="tick"></div>
        <h5>{text}</h5>
      </div>
    </a>
  </Col>
);

const HomeQuiz = () => {
  return (
    <div className="page-section grey">
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
        <Row className={utilStyles.SmRow}>
          {streamArray.map((item, index) => (
            <Col xs="12" md="4" className="mb-4" key={index}>
              <a href={`/training/${item.stream}`} target='_blank'>
                <div className={`stream-icon ${item.className}`}>
                  <div className="tick"></div>
                  <h5>{item.text}</h5>
                </div>
              </a>
            </Col>))}
        </Row>
      </Container>
    </div>
  )
};

export default HomeQuiz;