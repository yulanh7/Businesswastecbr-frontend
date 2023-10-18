import React, { useState, ChangeEvent, useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { registerGroupLeaderSlice, resetForm } from "../../store/userSlice";
// import { UserData } from "../../ultility/interfaces";
import { useAppDispatch, RootState } from '../../store';
import { useSelector } from 'react-redux';

const defaultuserProps = {
  firstName: "",
  lastName: "",
  email: "",
}

interface AddAdminModalProps {
  show: boolean;
  onHide: () => void;
}



function AddGroupLeaderModal({ show, onHide }: AddAdminModalProps) {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState(defaultuserProps);
  const { submitUserMessage, submitUserError } = useSelector((state: RootState) => state.user);
  const [formErrors, setFormErrors] = useState(defaultuserProps);

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
    }




    setFormErrors(newFormErrors);
    return isValid;
  };


  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));

  };

  useEffect(() => {
    if (submitUserMessage) {
      setFormData(defaultuserProps);
    }
  }, [submitUserMessage])


  const handleAddAdmin = async () => {
    if (validateForm()) {
      // dispatch(registerGroupLeaderSlice(formData));

    }
  };


  const handleOnHide = () => {
    onHide();
    setFormData(defaultuserProps);
    setFormErrors(defaultuserProps);
    dispatch(resetForm());
  }

  useEffect(() => {
    window.addEventListener('beforeunload', handleOnHide);
    return () => {
      window.removeEventListener('beforeunload', handleOnHide);
    }
  }, []);

  return (
    <Modal show={show} onHide={handleOnHide} size='lg'>
      <Modal.Header closeButton>
        <Modal.Title>Add Group Leader</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row>
            <Col xs='12' sm='6'>
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
            <Col xs='12' sm='6'>
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
            <Col xs='12' sm='6'>
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
        </Form>
        {submitUserMessage && <div className="success-message">{submitUserMessage}</div>}
        {submitUserError && <div className="error-message">{submitUserError}</div>}

      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleOnHide}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleAddAdmin}>
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AddGroupLeaderModal;
