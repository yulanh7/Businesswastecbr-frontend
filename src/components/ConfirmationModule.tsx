import React, { useState, ChangeEvent } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';


interface ConfirmationModuleProps {
  show: boolean;
  onHide: () => void;
  onEvent: () => void; // Assuming UserData is a type representing user data
}

function ConfirmationModule({ show, onHide, onEvent }: ConfirmationModuleProps) {


  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Log Out?</Modal.Title>
      </Modal.Header>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="primary" onClick={onEvent}>
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ConfirmationModule;
