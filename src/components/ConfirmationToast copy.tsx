import React from 'react';
import { Toast, Button } from 'react-bootstrap';
import utilStyles from "../styles/utils.module.scss";


interface ConfirmationToastProps {
  show: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmationToast: React.FC<ConfirmationToastProps> = ({
  show,
  onClose,
  onConfirm,
}) => {
  return (
    <Toast show={show} onClose={onClose}>
      <Toast.Header>
        <strong className="mr-auto">Confirm Submission</strong>
      </Toast.Header>
      <Toast.Body>
        <div className={`${utilStyles.flexCenter} mr-auto`}>
          <Button variant="secondary" size="sm" onClick={onClose} className={utilStyles.mR10px}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={onConfirm} className="ml-2">
            Confirm
          </Button>
        </div>
      </Toast.Body>
    </Toast>
  );
};

export default ConfirmationToast;
