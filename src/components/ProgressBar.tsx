import React from 'react';
import { ProgressBar as BootstrapProgressBar } from 'react-bootstrap';
import utilStyles from '../styles/utils.module.scss';

interface Props {
  currentQuizIndex: number;
  totalQuiz: number;
}

const ProgressBar: React.FC<Props> = ({ currentQuizIndex, totalQuiz }) => {
  const percentage = ((currentQuizIndex + 1) / totalQuiz) * 100;

  return (
    <div className={utilStyles.pB50px}>

      <BootstrapProgressBar now={percentage} label={`${currentQuizIndex + 1} / ${totalQuiz}`} />
    </div>
  );
};

export default ProgressBar;
