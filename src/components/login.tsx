import React, { useState, useRef, useEffect } from 'react';
import { Form, Button, InputGroup } from 'react-bootstrap';
import utilStyles from '../../src/styles/utils.module.scss'
import { loginSlice } from "../../store/userSlice";
import { useAppDispatch } from '../../store';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { hashPassword } from "../../ultility/ultility";
import ReCAPTCHA, { ReCAPTCHA as ReCAPTCHAType } from 'react-google-recaptcha';

type ActiveSection = 'login' | 'forgetPassword' | 'resetPassword';
const defaultFormProps = {
  email: '',
  password: '',
  showPassword: false,
  isRecaptchaVerified: ""
}
interface LoginComponentProps {
  handleActiveSection?: (section: ActiveSection) => void;
  submitUserError: string | null;
  submitUserLoading: boolean
}

const LoginComponent: React.FC<LoginComponentProps> = ({ handleActiveSection, submitUserError, submitUserLoading }) => {
  const [credentials, setCredentials] = useState(defaultFormProps);
  const [formErrors, setFormErrors] = useState(defaultFormProps);
  const [isRecaptchaVerified, setIsRecaptchaVerified] = useState(false);
  const recaptchaRef = useRef<ReCAPTCHAType | null>(null);

  const dispatch = useAppDispatch();


  const isValidEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const validateForm = () => {
    const newFormErrors = { ...defaultFormProps };
    let isValid = true;

    if (credentials.email.trim() === '') {
      newFormErrors.email = 'Email is required';
      isValid = false;
    }
    if (credentials.password.trim() === '') {
      newFormErrors.password = 'Password is required';
      isValid = false;
    }


    if (!isRecaptchaVerified) {
      newFormErrors.isRecaptchaVerified = 'Please verify reCAPTCHA before submitting.';
      isValid = false;
    }


    setFormErrors(newFormErrors);
    return isValid;
  };


  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const hashedPassword = hashPassword(credentials.password);
      const payload = {
        email: credentials.email,
        password: hashedPassword,
      }
      dispatch(loginSlice(payload));
    }
  };

  const handleFocus = () => {
    setFormErrors(defaultFormProps);
  }

  useEffect(() => {
    console.log('process.env.NODE_ENV', process.env.NODE_ENV)
    if (process.env.NODE_ENV === 'development') {
      // For localhost, set reCAPTCHA as verified automatically
      setIsRecaptchaVerified(true);
    }
  }, []);

  const handleRecaptchaChange = (token: string | null) => {
    if (token) {
      setIsRecaptchaVerified(true);
    } else {
      setIsRecaptchaVerified(false);
    }
  };
  return (
    <Form onSubmit={handleLogin}>
      <Form.Group controlId="email">
        <Form.Control
          type="text"
          placeholder="Email"
          value={credentials.email}
          onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
          onFocus={handleFocus}
          className={formErrors.email ? 'is-invalid' : ''}
          required
        />
        {formErrors.email && <div className="invalid-feedback">{formErrors.email}</div>}

      </Form.Group>

      <Form.Group controlId="password">
        <InputGroup>
          <Form.Control
            type={credentials.showPassword ? "text" : "password"}
            placeholder="Password"
            value={credentials.password}
            onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
            onFocus={handleFocus}
            className={formErrors.password ? 'is-invalid' : ''}
            required
          />
          <InputGroup.Text onClick={() => setCredentials(prev => ({ ...prev, showPassword: !prev.showPassword }))}>
            {credentials.showPassword ? <FaEyeSlash /> : <FaEye />}
          </InputGroup.Text>
        </InputGroup>
        {formErrors.password && <div className="invalid-feedback">{formErrors.password}</div>}

      </Form.Group>
      <ReCAPTCHA
        ref={recaptchaRef}
        sitekey="6Lf2NMUoAAAAALXNSMVQLOgvP65xYaVDiCjtTqBx"
        onChange={handleRecaptchaChange}
        className={`form-control form-recaptcha ${formErrors.isRecaptchaVerified ? 'is-invalid' : ''}`}

      />
      {formErrors.isRecaptchaVerified && <div className="invalid-feedback">{formErrors.isRecaptchaVerified}</div>}

      {submitUserError && <div className="error-message">{submitUserError}</div>}

      <div className={utilStyles.actionContainer}>
        <Button variant="primary" type="submit" disabled={submitUserLoading}>{submitUserLoading ? "Submitting..." : "Login"}</Button>
        <Button
          variant="link"
          onClick={() => handleActiveSection && handleActiveSection('forgetPassword')}
          className="back-link">
          Forgot password?
        </Button>
      </div>
    </Form>
  );
};

export default LoginComponent;
