// pages/quiz.tsx

import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getUserScoreSlice } from '../../store/quizSlice';
import { RootState, useAppDispatch } from '../../store';
import { Button, Image } from 'react-bootstrap';
import utilStyles from '../styles/utils.module.scss';
import Link from "next/link";






const CertificateComponent = () => {
  const { quizScore } = useSelector((state: RootState) => state.quiz);
  const dispatch = useAppDispatch();
  function formatDate(dateString: string) {
    const date = new Date(dateString);
    const day = ("0" + date.getDate()).slice(-2);
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }

  useEffect(() => {
    // This fetches the quiz data when the component mounts
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const parseUserInfo = JSON.parse(userInfo);
      const payload = {
        userId: parseUserInfo.id,
      }
      dispatch(getUserScoreSlice(payload));
    }
  }, [dispatch]);
  return (
    <div className={utilStyles.certificateContainer}>
      {
        quizScore && quizScore.highestScore < 90 && (
          <div className={utilStyles.textCenter}>
            <h5 className={utilStyles.inner}>You have not passed the quiz</h5>
            <Link href="/training">
              <Button >Go To Training</Button>
            </Link>
          </div>
        )

      }
      {
        quizScore && quizScore.highestScore >= 90 && (
          <>
            <div className={utilStyles.inner}>

              <Image src="/images/Logo-ClimateChoices.svg" alt="logo" width={160} className={utilStyles.logo} />
              <h4 className={utilStyles.username}>{quizScore.name}</h4>
              {/* <h4 className={utilStyles.username}>Eric</h4> */}
              <h4 className={utilStyles.logo}>Has successfully completed the ACTSmart Business
                and Once recycling training program.</h4>
              <h5 className={utilStyles.logo}>Completed modules:</h5>
              <ul className={utilStyles.modules}>
                <li>Paper and Cardboard</li>
                <li>Organic Material</li>
                <li>Mixed Recyclables</li>
                <li>Waste to Landfill</li>
                <li>Batteries</li>
                <li>Printer Cartridges</li>
              </ul>
              <h5 className={utilStyles.end}>Thank you for your contribution to reducing our carbon footprint and
                making Canberra a more sustainable city.</h5>
            </div>
            <div className={utilStyles.footer}>
              <div className={utilStyles.leftCol}>

                <h5 >
                  Date: <span className={utilStyles.date}>{formatDate(quizScore.scoreAchievementTime)}</span>
                </h5>
                <div className={utilStyles.actlogo}>
                  <Image src="/images/certificate3.png" alt="logo" width={300} className={utilStyles.img} />
                </div>
              </div>
              <div className={utilStyles.right}>
                <Image src="/images/certifacte2.png" alt="logo" width={200} className={utilStyles.imgCertificate} />
              </div>
            </div>
          </>
        )
      }



    </div>
  )
}

export default CertificateComponent;
