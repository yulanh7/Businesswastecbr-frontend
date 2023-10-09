import React, { useState, ChangeEvent, useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { resetForm } from '../../store/userSlice';
import { useAppDispatch, RootState } from '../../store';
import { useSelector } from 'react-redux';
import { askAQuestionSlice } from "../../store/userSlice";


const defaultUserQuestionProps = {
  userQuestion: '',
};

interface AskAQuestionModalProps {
  show: boolean;
  onHide: () => void;
}

function AskAQuestionModal({ show, onHide }: AskAQuestionModalProps) {
  const dispatch = useAppDispatch();
  const { submitUserMessage, submitUserError } = useSelector((state: RootState) => state.user);

  // Use object destructuring for state variables
  const [formData, setFormData] = useState(defaultUserQuestionProps);
  const [formErrors, setFormErrors] = useState(defaultUserQuestionProps);

  const validateForm = () => {
    const newFormErrors = { ...defaultUserQuestionProps };
    let isValid = true;

    if (formData.userQuestion.trim() === '') {
      newFormErrors.userQuestion = 'Your Question is required';
      isValid = false;
    }

    setFormErrors(newFormErrors);
    return isValid;
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (submitUserMessage) {
      // Reset form data and errors when a message is received
      setFormData(defaultUserQuestionProps);
      setFormErrors(defaultUserQuestionProps);
    }
  }, [submitUserMessage]);

  const handleAskAQuestion = async () => {
    if (validateForm()) {
      dispatch(askAQuestionSlice(formData));
    }
  };

  const handleOnHide = () => {
    onHide();
    // Reset form data and errors when the modal is hidden
    setFormData(defaultUserQuestionProps);
    setFormErrors(defaultUserQuestionProps);
    dispatch(resetForm());
  };

  return (
    <Modal show={show} onHide={handleOnHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Ask A Question</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row>
            <Col xs="12">
              <Form.Group controlId="userQuestion">
                <Form.Control
                  type="textarea"
                  name="userQuestion"
                  placeholder="Your Question"
                  value={formData.userQuestion}
                  onChange={handleChange}
                  className={formErrors.userQuestion && 'is-invalid'}
                  as="textarea"
                  rows={4}
                />
                {formErrors.userQuestion && (
                  <div className="invalid-feedback">{formErrors.userQuestion}</div>
                )}
              </Form.Group>
            </Col>
          </Row>
        </Form>
        {/* {message && <div className="success-message">{message}</div>}
        {error && <div className="error-message">{error}</div>} */}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleOnHide}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleAskAQuestion}>
          Submit
        </Button>
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
      </Modal.Footer>
    </Modal>
  );
}

export default AskAQuestionModal;
