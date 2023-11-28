import React, { useState, useEffect } from 'react';
import { Card } from 'react-bootstrap';
import Layout from '../src/components/Layout';
import utilStyles from '../src/styles/utils.module.scss';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../store';
import LoginComponent from "../src/components/login";  // Assuming LoginComponent is imported here
import ResetPassword from "../src/components/ResetPassword";
import ForgetPassword from "../src/components/ForgetPassword";
import { useRouter } from 'next/router';
import { resetForm } from "../store/userSlice";

type ActiveSection = 'login' | 'forgetPassword' | 'resetPassword';

interface LoginComponentProps {
  handleActiveSection: (section: ActiveSection) => void;
  // ... potentially other props ...
}

const LoginPage: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { token, para } = router.query;

  const [activeSection, setActiveSection] = useState<ActiveSection>('login');
  const [userToken, setUserToken] = useState('');


  const { submitUserError, submitUserMessage, submitUserLoading } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const wasReloaded = performance.navigation.type === performance.navigation.TYPE_RELOAD;
    if (wasReloaded) {
      // If the page was reloaded, use the section stored in localStorage
      const storedSection = localStorage.getItem('loginActiveSection');
      if (storedSection) {
        setActiveSection(storedSection as ActiveSection);
      }
    } else {
      if (para === 'resetPassword') setActiveSection('resetPassword');
    }
    if (token && typeof token === 'string') setUserToken(token);
  }, [para, token]);

  const handleBackToLogin = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    setActiveSection('login');
    dispatch(resetForm());
    localStorage.setItem('loginActiveSection', "login"); // Store the selected section in localStorage

  }

  const componentsMap = {
    login: <LoginComponent handleActiveSection={setActiveSection} submitUserError={submitUserError} submitUserLoading={submitUserLoading} />,   // Use setActiveSection directly
    forgetPassword: <ForgetPassword handleBackToLogin={handleBackToLogin} submitUserError={submitUserError} submitUserMessage={submitUserMessage} submitUserLoading={submitUserLoading} />,
    resetPassword: <ResetPassword handleBackToLogin={handleBackToLogin} token={userToken} submitUserError={submitUserError} submitUserMessage={submitUserMessage} submitUserLoading={submitUserLoading} />
  };

  return (
    <Layout>
      <Card className={`mt-5 page-section ${utilStyles.indexPageContainer}`}>
        {componentsMap[activeSection]}
      </Card>
    </Layout>
  );
};

export default LoginPage;
