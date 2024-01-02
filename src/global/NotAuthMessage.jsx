import React from 'react';

const NotAuthMessage = () => {
  const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh', // Set to 100% of the viewport height
  };

  const messageStyle = {
    padding: '20px',
    backgroundColor: '#f8d7da',
    color: '#721c24',
    border: '1px solid #f5c6cb',
    borderRadius: '5px',
    textAlign: 'center',
  };

  return (
    <div style={containerStyle}>
      <div style={messageStyle}>
        <strong>Unauthorized Access:</strong> You do not have permission to view this content.
      </div>
    </div>
  );
};

export default NotAuthMessage;
