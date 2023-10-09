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
  userType: "",
  businessDetails: {
    businessName: "",
    address: "",
    suburb: "",
    state: "",
    postcode: "",
    businessType: ""
  }
}

interface AddGroupLeaderModalProps {
  show: boolean;
  onHide: () => void;
}

interface Business {
  _id: string;
  businessName: string;
}


function AddGroupLeaderModal({ show, onHide }: AddGroupLeaderModalProps) {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState(defaultuserProps);
  const { submitUserMessage, submitUserError } = useSelector((state: RootState) => state.user);
  const [formErrors, setFormErrors] = useState(defaultuserProps);

  const validateForm = () => {
    const newFormErrors = { ...defaultuserProps, businessDetails: { ...defaultuserProps.businessDetails } };
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


    // Validating the businessType
    if (formData.businessDetails.businessType.trim() === '') {
      newFormErrors.businessDetails.businessType = 'Business Type is required';
      isValid = false;
    }

    // Validating the address
    if (formData.businessDetails.address.trim() === '') {
      newFormErrors.businessDetails.address = 'Address is required';
      isValid = false;
    }

    // Validating the suburb
    if (formData.businessDetails.suburb.trim() === '') {
      newFormErrors.businessDetails.suburb = 'Suburb is required';
      isValid = false;
    }

    // Validating the state
    if (formData.businessDetails.state.trim() === '') {
      newFormErrors.businessDetails.state = 'State is required';
      isValid = false;
    }

    // Validating the postcode
    if (formData.businessDetails.postcode.trim() === '') {
      newFormErrors.businessDetails.postcode = 'Postcode is required';
      isValid = false;
    }

    setFormErrors(newFormErrors);
    return isValid;
  };


  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name.startsWith("businessDetails.")) {
      const key = name.split(".")[1];
      setFormData(prevData => ({
        ...prevData,
        businessDetails: {
          ...prevData.businessDetails,
          [key]: value
        }
      }));
    } else {
      setFormData(prevData => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  useEffect(() => {
    if (submitUserMessage) {
      setFormData(defaultuserProps);
    }
  }, [submitUserMessage])


  const handleAddGroupLeader = async () => {
    if (validateForm()) {
      dispatch(registerGroupLeaderSlice({ ...formData, userType: "Group Leader" }));

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

            <Col xs='12'>
              <Form.Group controlId="businessName">
                <Form.Control
                  type="text"
                  placeholder='Business Name'
                  name="businessDetails.businessName"
                  value={formData.businessDetails.businessName}
                  onChange={handleChange}
                  className={formErrors.businessDetails.businessName && 'is-invalid'}
                />
                {formErrors.businessDetails.businessName && <div className="invalid-feedback">{formErrors.businessDetails.businessName}</div>}

              </Form.Group>
            </Col>
            <Col xs='12'>
              <Form.Group controlId="businessType">
                <Form.Control
                  type="text"
                  name="businessDetails.businessType"
                  placeholder='Business Type'
                  value={formData.businessDetails.businessType}
                  onChange={handleChange}
                  className={formErrors.businessDetails.businessType && 'is-invalid'}
                />
                {formErrors.businessDetails.businessType && <div className="invalid-feedback">{formErrors.businessDetails.businessType}</div>}

              </Form.Group>
            </Col>
            <Col xs='12' sm='6'>
              <Form.Group controlId="address">
                <Form.Control
                  type="text"
                  placeholder='Address'
                  name="businessDetails.address"   // This should be "businessDetails.address"
                  value={formData.businessDetails.address}
                  onChange={handleChange}
                  className={formErrors.businessDetails.address && 'is-invalid'}
                />
                {formErrors.businessDetails.address && <div className="invalid-feedback">{formErrors.businessDetails.address}</div>}
              </Form.Group>
            </Col>
            <Col xs='12' sm='6'>
              <Form.Group controlId="suburb">
                <Form.Control
                  type="text"
                  placeholder="Suburb"
                  name='businessDetails.suburb'
                  value={formData.businessDetails.suburb}
                  onChange={handleChange}
                  className={formErrors.businessDetails.suburb && 'is-invalid'}
                />
                {formErrors.businessDetails.suburb && <div className="invalid-feedback">{formErrors.businessDetails.suburb}</div>}
              </Form.Group>
            </Col>
            <Col xs='12' sm='6'>
              <Form.Group controlId="state">
                <Form.Control
                  as="select"
                  name="businessDetails.state"
                  value={formData.businessDetails.state}
                  onChange={handleChange}
                  className={formErrors.businessDetails.state && 'is-invalid'}
                >
                  <option value="">Select State</option>
                  <option value="NSW">New South Wales</option>
                  <option value="VIC">Victoria</option>
                  <option value="QLD">Queensland</option>
                  <option value="SA">South Australia</option>
                  <option value="WA">Western Australia</option>
                  <option value="TAS">Tasmania</option>
                  <option value="ACT">Australian Capital Territory</option>
                  <option value="NT">Northern Territory</option>
                </Form.Control>
                {formErrors.businessDetails.state && <div className="invalid-feedback">{formErrors.businessDetails.state}</div>}
              </Form.Group>

            </Col>
            <Col xs='12' sm='6'>
              <Form.Group controlId="postcode">
                <Form.Control
                  type="text"
                  name="businessDetails.postcode"
                  placeholder='Postcode'
                  value={formData.businessDetails.postcode}
                  onChange={handleChange}
                  className={formErrors.businessDetails.postcode && 'is-invalid'}
                />
                {formErrors.businessDetails.postcode && <div className="invalid-feedback">{formErrors.businessDetails.postcode}</div>}
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
        <Button variant="primary" onClick={handleAddGroupLeader}>
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AddGroupLeaderModal;
