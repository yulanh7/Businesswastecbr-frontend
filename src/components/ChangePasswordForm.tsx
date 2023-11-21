import React, { useState, useEffect, ChangeEvent } from 'react';
import { Form, Button, InputGroup } from 'react-bootstrap';
import { changePasswordSlice, resetForm } from "../../store/userSlice";
import { RootState, useAppDispatch } from '../../store';
import { useSelector } from 'react-redux';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { hashPassword } from "../../ultility/ultility";
import utilStyles from '../../src/styles/utils.module.scss';


type VisibilityKey = 'currentPassword' | 'newPassword' | 'confirmPassword';
type MessageKey = 'success' | 'failure' | 'passwordError' | 'confirmPasswordError';


const ChangePasswordForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const { submitUserMessage, submitUserError } = useSelector((state: RootState) => state.user);
  const [passwordError, setPasswordError] = useState('');

  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [visibility, setVisibility] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false
  });

  const [messages, setMessages] = useState({
    success: '',
    failure: '',
  });

  useEffect(() => {
    if (submitUserMessage) setMessages(prev => ({ ...prev, success: submitUserMessage }));
    if (submitUserError) setMessages(prev => ({ ...prev, failure: submitUserError }));
  }, [submitUserMessage, submitUserError]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setMessages({
      success: '',
      failure: '',
    });
    setPasswordError("");
  }

  const handleSubmitChangePassword = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!/^.*(?=.{8,})(?=.*\d)(?=.*[a-zA-Z]).*$/.test(formData.newPassword)) {
      setPasswordError('Password must be at least 8 characters long and contain at least one number and one letter');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }

    const payload = {
      currentPassword: hashPassword(formData.currentPassword),
      newPassword: hashPassword(formData.newPassword)
    }

    dispatch(changePasswordSlice(payload));
    dispatch(resetForm());
  }

  const renderInput = (name: VisibilityKey, placeholder: string) => (
    <Form.Group>
      <InputGroup>
        <Form.Control
          type={visibility[name] ? "text" : "password"}
          placeholder={placeholder}
          name={name}
          value={formData[name]}
          onChange={handleChange}
          required
        />
        <InputGroup.Text onClick={() => setVisibility(prev => ({ ...prev, [name]: !prev[name] }))}>
          {visibility[name] ? <FaEyeSlash /> : <FaEye />}
        </InputGroup.Text>
      </InputGroup>
    </Form.Group>
  );
  return (
    <Form onSubmit={handleSubmitChangePassword}>
      {renderInput('currentPassword', 'Enter current password')}
      {renderInput('newPassword', 'Enter new password')}
      {renderInput('confirmPassword', 'Confirm new password')}
      {passwordError && <div className="error-message">*{passwordError}</div>}
      {!passwordError && <div className="password-message">*Password must be at least 8 characters long and contain at least one number and one letter</div>}
      {messages.success && <div className="success-message">{messages.success}</div>}
      {messages.failure && <div className="error-message">{messages.failure}</div>}
      <Button variant="primary" type="submit">
        Change password
      </Button>
    </Form >
  );
};

export default ChangePasswordForm;
