import React, { useEffect, useState } from 'react';
import utilStyles from "../styles/utils.module.scss";
import { Button, Container, Row, Col } from "react-bootstrap";
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../store';
import { isValidEmail } from "../../ultility/ultility";

export default function RegisterComponent() {
  const dispatch = useAppDispatch();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [address, setAddress] = useState('');
  const [suburb, setSuburb] = useState('');
  const [state, setState] = useState('');
  const [postcode, setPostCode] = useState('');

  const [errors, setErrors] = useState<{
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    businessName?: string;
    address?: string;
    suburb?: string;
    state?: string;
    postcode?: string;
  }>({});


  const validateForm = () => {
    let isValid = true;
    const newErrors: {
      firstName?: string;
      lastName?: string;
      email?: string;
      phone?: string;
      businessName?: string;
      address?: string;
      suburb?: string;
      state?: string;
      postcode?: string;
    } = {};

    if (firstName.trim() === '') {
      newErrors.firstName = 'First name is required';
      isValid = false;
    }

    if (lastName.trim() === '') {
      newErrors.lastName = 'Last name is required';
      isValid = false;
    }

    if (email.trim() === '') {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!isValidEmail(email)) {
      newErrors.email = 'Email is invalid';
      isValid = false;
    }

    if (phone.trim() === '') {
      newErrors.phone = 'Phone is required';
      isValid = false;
    }

    if (businessName.trim() === '') {
      newErrors.businessName = 'Business name is required';
      isValid = false;
    }
    if (address.trim() === '') {
      newErrors.address = 'Business Address is required';
      isValid = false;
    }
    if (suburb.trim() === '') {
      newErrors.suburb = 'Suburb is required';
      isValid = false;
    }
    if (state.trim() === '') {
      newErrors.state = 'State is required';
      isValid = false;
    }
    if (postcode.trim() === '') {
      newErrors.postcode = 'Postcode is required';
      isValid = false;
    }


    setErrors(newErrors);

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      const payload = {
        firstName,
        lastName,
        email,
        phone,
        businessName,
        address,
        suburb,
        state,
        postcode,
      }
    }
  }


  return (
    <div className={utilStyles.loginFormContainer}>
      <form className={utilStyles.form} onSubmit={handleSubmit}>
        <div className={utilStyles.pB10px}>
          <Row>
            <Col sm="6" xs="12">
              <input
                type="text"
                placeholder=' First Name'
                className={`form-control ${errors.firstName && 'is-invalid'}`}
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              {errors.firstName && (
                <div className="invalid-feedback">{errors.firstName}</div>
              )}
            </Col>
            <Col sm="6" xs="12">
              <input
                type="text"
                placeholder="Last Name"
                className={`form-control ${errors.lastName && 'is-invalid'}`}
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
              {errors.lastName && (
                <div className="invalid-feedback">{errors.lastName}</div>
              )}
            </Col>
          </Row>
          <Row>
            <Col sm="6" xs="12">
              <input
                type="email"
                placeholder="Email"
                className={`form-control ${errors.email && 'is-invalid'}`}
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && (
                <div className="invalid-feedback">{errors.email}</div>
              )}
            </Col>
            <Col sm="6" xs="12">
              <input
                type="text"
                placeholder="Phone"
                className={`form-control ${errors.phone && 'is-invalid'}`}
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              {errors.phone && (
                <div className="invalid-feedback">{errors.phone}</div>
              )}
            </Col>
          </Row>
          <Row>
            <Col xs="12">
              <input
                type="text"
                placeholder="Business Name"
                className={`form-control ${errors.businessName && 'is-invalid'}`}
                id="businessName"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
              />
              {errors.businessName && (
                <div className="invalid-feedback">{errors.businessName}</div>
              )}
            </Col>
          </Row>
          <Row>
            <Col sm="6" xs="12">
              <input
                type="text"
                placeholder="Business Address"
                className={`form-control ${errors.address && 'is-invalid'}`}
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              {errors.address && (
                <div className="invalid-feedback">{errors.address}</div>
              )}
            </Col>
            <Col sm="6" xs="12">
              <input
                type="text"
                placeholder="Suburb"
                className={`form-control ${errors.suburb && 'is-invalid'}`}
                id="suburb"
                value={suburb}
                onChange={(e) => setSuburb(e.target.value)}
              />
              {errors.suburb && (
                <div className="invalid-feedback">{errors.suburb}</div>
              )}
            </Col>
          </Row>
          <Row>
            <Col sm="6" xs="12">
              <select
                className={`form-control ${errors.state && 'is-invalid'}`}
                name="state"
                placeholder="Business Name"
                onChange={(e) => setState(e.target.value)}
              >
                <option value="">State</option>
                <option value="Australian Capital Territory">Australian Capital Territory</option>
                <option value="New South Wales">New South Wales</option>
                <option value="Victoria">Victoria</option>
                <option value="Queensland">Queensland</option>
                <option value="Western Australia">Western Australia</option>
                <option value="South Australia">South Australia</option>
                <option value="Tasmania">Tasmania</option>
                <option value="Northern Territory">Northern Territory</option>
              </select>
              {errors.state && (
                <div className="invalid-feedback">{errors.state}</div>
              )}
            </Col>
            <Col sm="6" xs="12">
              <input
                type="text"
                placeholder="Postcode"
                className={`form-control ${errors.postcode && 'is-invalid'}`}
                id="postcode"
                value={postcode}
                onChange={(e) => setPostCode(e.target.value)}
              />
              {errors.postcode && (
                <div className="invalid-feedback">{errors.postcode}</div>
              )}
            </Col>
          </Row>
        </div>
        <div className={utilStyles.textCenter}>
          <Button
            variant="primary"
            type="submit"
          // className={utilStyles.button}
          >
            SUBMIT
          </Button>
        </div>
      </form>
    </div>
  )



}