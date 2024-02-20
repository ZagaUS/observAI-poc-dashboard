

// import React from 'react';
// import Button from '@mui/material/Button';
// import { useNavigate } from 'react-router-dom';

// const PrivateRouter = () => {
//   const navigate = useNavigate();

//   const handleGoBack = () => {
//     navigate(-1); // This is equivalent to history.goBack()
//   };

//   return (
//     <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
//       <p style={{ fontWeight: 'bold', fontSize: 20 }}>Permission Denied: Access restricted to authorized users only.</p>
//       <Button variant="contained" color="primary" onClick={handleGoBack} style={{ marginTop: '10px' }}>
//         Go Back
//       </Button>
//     </div>
//   );
// }

// export default PrivateRouter;

import React from 'react';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

const PrivateRouter = ({ isDarkMode }) => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // This is equivalent to history.goBack()
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <p style={{ fontWeight: 'bold', fontSize: 20 }}>Permission Denied: Access restricted to authorized users only.</p>
      <Button 
        variant="contained" 
        color="primary" 
        onClick={handleGoBack} 
        sx={{ 
          marginTop: '10px',
          color: isDarkMode ? 'black' : 'black', // Set text color based on dark mode
          backgroundColor: isDarkMode ? '#2C3539' : '#e0e0e0', // Set background color based on dark mode
          '&:hover': {
            backgroundColor: isDarkMode ? '#ffffff' : '#ffffff', // Set background color on hover based on dark mode
            color: isDarkMode ? 'primary' : 'black' // Set text color on hover based on dark mode
          }
        }}
      >
        Go Back
      </Button>
    </div>
  );
}

export default PrivateRouter;
