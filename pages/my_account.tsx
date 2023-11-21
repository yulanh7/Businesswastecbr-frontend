import React, { HtmlHTMLAttributes, useState, useEffect } from 'react';
import Layout from '../src/components/Layout';
import { Row, Col, Button, Container } from 'react-bootstrap';
import ProfileComponent from "../src/components/ProfileForm";
import ChangePasswordForm from "../src/components/ChangePasswordForm";
import ConfirmationModule from "../src/components/ConfirmationModule";
import { useRouter } from 'next/router';
import utilStyles from '../src/styles/utils.module.scss';
import Link from "next/link";
import pageStyles from '../src/styles/page.module.scss'
import downloadPdf from '../ultility/downloadPdf';
import { RootState, useAppDispatch } from '../store';
import { getUserScoreSlice } from '../store/quizSlice';
import { useSelector } from 'react-redux';



type UserInfoType = {
  userType: 'Admin' | 'Group Leader';
  firstName: string;
  // ... any other properties you expect on userInfo
} | null;


function HomePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { para } = router.query;
  const [userInfo, setUserInfo] = useState<UserInfoType>(null);
  const [activeSection, setActiveSection] = useState('profile'); // Default active tab is 'profile'
  const [showModal, setShowModal] = useState(false);
  const { quizScore } = useSelector((state: RootState) => state.quiz);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleSelect = (e: any, section: string) => {
    e.preventDefault();
    setActiveSection(section);
    localStorage.setItem('accountActiveSection', section); // Store the selected section in localStorage

  }

  useEffect(() => {
    const storedUserInfo = localStorage.getItem('userInfo');

    if (storedUserInfo) {
      const parsedInfo = JSON.parse(storedUserInfo);
      setUserInfo(parsedInfo);
    }
  }, [])

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

  useEffect(() => {
    const wasReloaded = performance.navigation.type === performance.navigation.TYPE_RELOAD;
    if (wasReloaded) {
      // If the page was reloaded, use the section stored in localStorage
      const storedSection = localStorage.getItem('accountActiveSection');
      if (storedSection) {
        setActiveSection(storedSection);
      }
    } else {
      // If navigated to the page via a link, use the 'para' query parameter
      if (para === 'profile') {
        setActiveSection('profile');
      }
      if (para === 'changePassword') {
        setActiveSection('changePassword');
      }

    }
  }, [para]);


  const handleLogout = async () => {
    try {
      localStorage.removeItem("userInfo"); // Clear userInfo from local storage
      localStorage.removeItem("token"); // Clear userInfo from local storage
      setUserInfo(null); // Set userInfo state to null
      router.push('/')
    } catch (error) {
      // Handle error
    }
  };

  return (
    <Layout>
      <Container className={`${utilStyles.flexCenter} page-section`}>
        {
          userInfo ?
            (<Row className="account-container">
              <Col sm="3" className="account-container-left">
                <h5 className='section-title'>Account</h5>
                <div>
                  <Button onClick={(e) => handleSelect(e, 'profile')} className={activeSection == 'profile' ? 'active' : ''}>Profile</Button>
                </div>
                <div>
                  <Button onClick={(e) => handleSelect(e, 'changePassword')} className={activeSection == 'changePassword' ? 'active' : ''}>Change password</Button>
                </div>
                <div>
                  <Button onClick={(e) => handleLogout()}>Log out</Button>
                </div>
              </Col>
              <Col sm="9">
                {activeSection == "profile" && (
                  <>
                    <h5 className='section-title'>Profile</h5>
                    <ProfileComponent />
                  </>
                )}
                {activeSection == "changePassword" && (
                  <>
                    <h5 className='section-title'>Change password</h5>
                    <ChangePasswordForm />
                  </>
                )}

              </Col>
              <ConfirmationModule show={showModal} onHide={handleCloseModal} onEvent={handleLogout} />
            </Row>) : (
              <div>
                <p>Please <Link href='/login'>Login</Link></p>

              </div>
            )
        }
      </Container>

    </Layout>
  )
}

export default HomePage;
