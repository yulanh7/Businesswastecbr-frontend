import React from 'react';
import { Spinner } from 'react-bootstrap';


const LoadingSpinner = () => {

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Spinner animation="border" role="status" style={{ color: '#007D34' }}>
      </Spinner>
    </div>
  );
};

export default LoadingSpinner;
