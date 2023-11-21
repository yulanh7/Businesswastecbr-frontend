import React, { useState } from 'react';
import { Form, Button, InputGroup } from 'react-bootstrap';
import utilStyles from '../styles/utils.module.scss';
import { resetPasswordSlice } from "../../store/userSlice";
import { useAppDispatch } from '../../store';
import { FaArrowLeft } from 'react-icons/fa';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import lock icons
import { hashPassword } from "../../ultility/ultility";

interface ResetPasswordPros {
  handleBackToLogin: (e: any) => void;
  token: string;
  submitUserError: string | null;
  submitUserMessage: string | null;
  submitUserLoading: boolean
}


const ResetPassword: React.FC<ResetPasswordPros> = ({ handleBackToLogin, token, submitUserError, submitUserMessage, submitUserLoading }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setConfirmShowPassword] = useState(false);
  const dispatch = useAppDispatch();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleResetPassword = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!/^.*(?=.{8,})(?=.*\d)(?=.*[a-zA-Z]).*$/.test(password)) {
      setPasswordError('Password must be at least 8 characters long and contain at least one number and one letter');
      return;
    }
    // Confirm password validation
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }
    dispatch(resetPasswordSlice({ token, password: hashPassword(password) }));
  };

  return (
    <Form onSubmit={handleResetPassword}>
      <Form.Group>
        <InputGroup>
          <Form.Control
            type={showPassword ? "text" : "password"}
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <InputGroup.Text onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </InputGroup.Text>
        </InputGroup>
      </Form.Group>
      <Form.Group>
        <InputGroup>
          <Form.Control
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <InputGroup.Text onClick={() => setConfirmShowPassword(!showConfirmPassword)}>
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </InputGroup.Text>
        </InputGroup>
        {passwordError && <div className="error-message">*{passwordError}</div>}
        {!passwordError && <div className="password-message">*Password must be at least 8 characters long and contain at least one number and one letter</div>}
        {/* {confirmPasswordError && <div className="error-message">{confirmPasswordError}</div>} */}
        {submitUserMessage && <div className="success-message">{submitUserMessage}</div>}
        {submitUserError && <div className="error-message">{submitUserError}</div>}
      </Form.Group>
      <div className={utilStyles.actionContainer}>

        <Button variant="link" onClick={handleBackToLogin} className="back-link">
          <FaArrowLeft /> Back to login
        </Button>
        <Button variant="primary" type="submit" disabled={submitUserLoading}>
          {submitUserLoading ? "Submitting..." : "Submit"}
        </Button>
      </div>
    </Form>

  );
};

export default ResetPassword;
