import React, { useState, ChangeEvent, useEffect } from 'react';
import utilStyles from "../styles/utils.module.scss";
import { Button, Form, Row, Col } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../store';
import { isValidEmail } from "../../ultility/ultility";
import { fetchSelfDetailSlice, updateSelfDetailSlice, resetForm } from "../../store/userSlice";

const defaultuserProps = {
  firstName: '',
  lastName: '',
  email: '',
}

export default function ProfileComponent() {
  const dispatch = useAppDispatch();
  const { submitUserMessage, submitUserError, selfDetail } = useSelector((state: RootState) => state.user);
  const [formData, setFormData] = useState(defaultuserProps);
  const [formErrors, setFormErrors] = useState(defaultuserProps);

  useEffect(() => {
    dispatch(fetchSelfDetailSlice());
  }, [])

  useEffect(() => {
    setFormData(selfDetail)
  }, [selfDetail])

  const validateForm = () => {
    const newFormErrors = { ...defaultuserProps };
    let isValid = true;

    // Validating the firstName
    if (formData.firstName.trim() === '') {
      newFormErrors.firstName = 'First Name is required';
      isValid = false;
    }

    // Validating the lastName
    if (formData.lastName.trim() === '') {
      newFormErrors.lastName = 'Last Name is required';
      isValid = false;
    }

    // Validating the email
    if (formData.email.trim() === '') {
      newFormErrors.email = 'Email is required';
      isValid = false;
    } else if (!isValidEmail(formData.email.trim())) {
      newFormErrors.email = 'Invalid email format';
      isValid = false;
    }



    // ... Add similar validations for other fields

    return { isValid, newFormErrors };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { isValid, newFormErrors } = validateForm();
    setFormErrors(newFormErrors);

    if (isValid) {
      dispatch(updateSelfDetailSlice(formData));
      setFormErrors(defaultuserProps);
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    dispatch(resetForm());
  };
  return (
    <div>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col xs='12' >
            <Form.Group controlId="firstName">
              <Form.Control
                type="text"
                name="firstName"
                placeholder='First Name'
                value={formData.firstName}
                onChange={handleChange}
                className={formErrors.firstName && 'is-invalid'}
              />
              {formErrors.firstName && <div className="invalid-feedback">{formErrors.firstName}</div>}
            </Form.Group>
          </Col>
          <Col xs='12' >
            <Form.Group controlId="lastName">
              <Form.Control
                type="text"
                name="lastName"
                placeholder='Last Name'
                value={formData.lastName}
                onChange={handleChange}
                className={formErrors.lastName && 'is-invalid'}
              />
              {formErrors.lastName && <div className="invalid-feedback">{formErrors.lastName}</div>}
            </Form.Group>
          </Col>
          <Col xs='12' >
            <Form.Group controlId="email">
              <Form.Control
                type="email"
                name="email"
                placeholder='Email'
                value={formData.email}
                onChange={handleChange}
                className={formErrors.email && 'is-invalid'}
              />
              {formErrors.email && <div className="invalid-feedback">{formErrors.email}</div>}
            </Form.Group>
          </Col>

        </Row>

        <div className={utilStyles.textCenter}>
          <Button
            variant="primary"
            type="submit"
            className={utilStyles.button}
          >
            SUBMIT
          </Button>
        </div>
        {submitUserMessage && (
          <div className="success-message">
            {submitUserMessage}
          </div>
        )}
        {submitUserError && (
          <div className="error-message">
            {submitUserError}
          </div>
        )}
      </Form>
    </div>
  )



}