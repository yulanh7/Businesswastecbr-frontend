import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import utilStyles from '../styles/utils.module.scss';
import { forgetPasswordSlice } from "../../store/userSlice";
import { useAppDispatch } from '../../store';
import { FaArrowLeft } from 'react-icons/fa';

interface ResetPasswordPros {
  handleBackToLogin: (e: any) => void;
  submitUserError: string | null;
  submitUserMessage: string | null;
  submitUserLoading: boolean
}


const ResetPassword: React.FC<ResetPasswordPros> = ({ handleBackToLogin, submitUserError, submitUserMessage, submitUserLoading }) => {
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState('');
  const handleForgetPassword = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(forgetPasswordSlice({ email }));
  }
  return (
    <>
      <p>
        Please enter your email address.
        You will receive an email message with a link to reset your password.
      </p>
      <Form onSubmit={handleForgetPassword}>
        <Form.Group>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>
        <div>
          {submitUserMessage && <div className="success-message">{submitUserMessage}</div>}
          {submitUserError && <div className="error-message">{submitUserError}</div>}
        </div>
        <div className={utilStyles.actionContainer}>
          <Button variant="link" onClick={handleBackToLogin} className="back-link">
            <FaArrowLeft /> Back to Login
          </Button>
          <Button variant="primary" type="submit" disabled={submitUserLoading}>
            {submitUserLoading ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </Form>
    </>

  );
};

export default ResetPassword;
