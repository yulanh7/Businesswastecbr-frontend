import React, { useState, ChangeEvent, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Image } from 'react-bootstrap';
import information_example from '../../public/images/information_example.jpg'

interface InformationModuleProps {
  show: boolean;
  onHide: () => void;
}


function InformationModule({ show, onHide }: InformationModuleProps) {

  return (
    <Modal show={show} onHide={onHide} size='lg'>
      <Modal.Header closeButton>
      </Modal.Header>
      <Modal.Body>

        <Image
          src='/images/information_example.jpg'
          alt="Information Example"
        />
      </Modal.Body>
    </Modal>

  )


}


export default InformationModule;