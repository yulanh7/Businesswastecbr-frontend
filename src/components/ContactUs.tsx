import React, { useState, ChangeEvent, useRef } from 'react';
import { Container, Row, Col } from "react-bootstrap";
import { RootState, useAppDispatch } from '../../store';
// import ReCAPTCHA from 'react-google-recaptcha';
import utilStyles from "../styles/utils.module.scss";
import pageStyles from "../styles/page.module.scss";
import { Form, Button } from 'react-bootstrap';
import { FaAddressCard, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import { contactUsSlice, resetForm } from "../../store/userSlice";
import { useSelector } from 'react-redux';
import ReCAPTCHA, { ReCAPTCHA as ReCAPTCHAType } from 'react-google-recaptcha';

const defaultFormProps = {
  name: "",
  phone: "",
  email: "",
  message: "",
  isRecaptchaVerified: ""
}

export default function ContactUs() {
  const dispatch = useAppDispatch();
  const recaptchaRef = useRef<ReCAPTCHAType | null>(null);
  const { submitUserMessage, submitUserError } = useSelector((state: RootState) => state.user);

  const [isRecaptchaVerified, setIsRecaptchaVerified] = useState(false);
  const [formData, setFormData] = useState(defaultFormProps);
  const [formErrors, setFormErrors] = useState(defaultFormProps);


  const isValidEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const validateForm = () => {
    const newFormErrors = { ...defaultFormProps };
    let isValid = true;

    // Validating the name
    if (formData.name.trim() === '') {
      newFormErrors.name = 'Your Name is required';
      isValid = false;
    }


    // Validating the email
    if (formData.email.trim() === '') {
      newFormErrors.email = 'Email is required';
      isValid = false;
    }

    // Validating the phone
    // if (formData.phone.trim() === '') {
    //   newFormErrors.phone = 'Phone is required';
    //   isValid = false;
    // }

    // Validating the phone
    if (formData.message.trim() === '') {
      newFormErrors.message = 'Message is required';
      isValid = false;
    }

    if (!isRecaptchaVerified) {
      newFormErrors.isRecaptchaVerified = 'Please verify reCAPTCHA before submitting.';
      isValid = false;
    }


    setFormErrors(newFormErrors);
    return isValid;
  };

  const handleRecaptchaChange = (token: string | null) => {
    if (token) {
      setIsRecaptchaVerified(true);
    } else {
      setIsRecaptchaVerified(false);
    }
  };
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    dispatch(resetForm())
  };


  const handleSubmit = async () => {
    if (validateForm()) {
      await dispatch(contactUsSlice(formData))
      setFormData(defaultFormProps);
      setIsRecaptchaVerified(false); // Resetting the isRecaptchaVerified state
      if (recaptchaRef.current) {
        recaptchaRef.current.reset(); // Resetting the reCAPTCHA
      }
    }
  };

  const handleFocus = () => {
    setFormErrors(defaultFormProps);
  }


  return (

    <div className={pageStyles.contactUsContainer} id="contactUs">
      <div className={pageStyles.innerContainer}>
        <h3 className={utilStyles.sectionTitleCenter}>CONTACT US</h3>
        <Row>
          <Col xs="12" sm="5" className={pageStyles.leftCol}>
            <p>Please feel free to reach out if you have any questions.</p>
            <p><a href='tel:132281'> <FaPhone size={24} />13 22 81</a></p>
            <p><a href='maito:sustainablebusiness@act.gov.au'> <FaEnvelope size={24} />sustainablebusiness@act.gov.au</a></p>
            <p> <FaAddressCard size={24} /> <span>GPO Box 158, Canberra City ACT 2601</span></p>
            <p> <FaMapMarkerAlt size={24} /> <span>480 Northbourne Avenue Dickson ACT 2602</span></p>
          </Col>
          <Col xs="12" sm="7">
            <Form>
              <Row>
                <Col xs='12' sm='6'>
                  <Form.Group controlId="name">
                    <Form.Control
                      type="text"
                      name="name"
                      placeholder='First Name'
                      value={formData.name}
                      onChange={handleChange}
                      onFocus={handleFocus}
                      className={formErrors.name ? 'is-invalid' : ''}
                    />
                    {formErrors.name && <div className="invalid-feedback">{formErrors.name}</div>}
                  </Form.Group>
                </Col>

                <Col xs='12' sm='6'>
                  <Form.Group controlId="phone">
                    <Form.Control
                      type="text"
                      name="phone"
                      placeholder='Phone'
                      value={formData.phone}
                      onChange={handleChange}
                      onFocus={handleFocus}
                      className={formErrors.phone ? 'is-invalid' : ''}
                    />
                    {formErrors.phone && <div className="invalid-feedback">{formErrors.phone}</div>}
                  </Form.Group>
                </Col>
                <Col xs='12'>
                  <Form.Group controlId="email">
                    <Form.Control
                      type="email"
                      name="email"
                      placeholder='Email'
                      value={formData.email}
                      onChange={handleChange}
                      onFocus={handleFocus}
                      className={formErrors.email ? 'is-invalid' : ''}
                    />
                    {formErrors.email && <div className="invalid-feedback">{formErrors.email}</div>}
                  </Form.Group>
                </Col>
                <Col xs='12' >
                  <Form.Group controlId="message">
                    <Form.Control
                      as="textarea"
                      rows={4}
                      name="message"
                      placeholder='Message'
                      value={formData.message}
                      onChange={handleChange}
                      onFocus={handleFocus}
                      className={formErrors.message ? 'is-invalid' : ''}
                    />
                    {formErrors.message && <div className="invalid-feedback">{formErrors.message}</div>}
                  </Form.Group>
                </Col>
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey="6Lf2NMUoAAAAALXNSMVQLOgvP65xYaVDiCjtTqBx"
                  onChange={handleRecaptchaChange}
                  className={`form-control form-recaptcha ${formErrors.isRecaptchaVerified ? 'is-invalid' : ''}`}

                />
                {formErrors.isRecaptchaVerified && <div className="invalid-feedback">{formErrors.isRecaptchaVerified}</div>}

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
                <Button variant="primary" onClick={handleSubmit}>
                  Submit
                </Button>
              </Row>
            </Form>
          </Col>
        </Row>

        {/* <ReCAPTCHA
        sitekey="6Lf2NMUoAAAAALXNSMVQLOgvP65xYaVDiCjtTqBx"
        onChange={handleRecaptchaChange}
        className={`form-control ${errors.isRecaptchaVerified ? 'is-invalid' : ''}`}

      />
      {errors.isRecaptchaVerified && <div className="invalid-feedback">{errors.isRecaptchaVerified}</div>} */}
      </div>
    </div>
  );
}
