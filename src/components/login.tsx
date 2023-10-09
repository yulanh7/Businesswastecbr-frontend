import React, { useState } from 'react';
import { Form, Button, InputGroup } from 'react-bootstrap';
import utilStyles from '../../src/styles/utils.module.scss'
import { loginSlice } from "../../store/userSlice";
import { useAppDispatch } from '../../store';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { hashPassword } from "../../ultility/ultility";

type ActiveSection = 'login' | 'forgetPassword' | 'resetPassword';

interface LoginComponentProps {
  handleActiveSection?: (section: ActiveSection) => void;
  submitUserError: string | null;
  submitUserLoading: boolean
}

const LoginComponent: React.FC<LoginComponentProps> = ({ handleActiveSection, submitUserError, submitUserLoading }) => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
    showPassword: false
  });

  const dispatch = useAppDispatch();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const hashedPassword = hashPassword(credentials.password);
    const payload = {
      email: credentials.email,
      password: hashedPassword,
    }
    dispatch(loginSlice(payload));
  };


  return (
    <Form onSubmit={handleLogin}>
      <Form.Group controlId="email">
        <Form.Control
          type="text"
          placeholder="Email"
          value={credentials.email}
          onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
          required
        />
      </Form.Group>

      <Form.Group controlId="password">
        <InputGroup>
          <Form.Control
            type={credentials.showPassword ? "text" : "password"}
            placeholder="Password"
            value={credentials.password}
            onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
            required
          />
          <InputGroup.Text onClick={() => setCredentials(prev => ({ ...prev, showPassword: !prev.showPassword }))}>
            {credentials.showPassword ? <FaEyeSlash /> : <FaEye />}
          </InputGroup.Text>
        </InputGroup>
      </Form.Group>

      {submitUserError && <div className="error-message">{submitUserError}</div>}

      <div className={utilStyles.actionContainer}>
        <Button variant="primary" type="submit" disabled={submitUserLoading}>{submitUserLoading ? "Submitting..." : "Login"}</Button>
        <Button
          variant="link"
          onClick={() => handleActiveSection && handleActiveSection('forgetPassword')}
          className="back-link">
          Forgot Password?
        </Button>
      </div>
    </Form>
  );
};

export default LoginComponent;
