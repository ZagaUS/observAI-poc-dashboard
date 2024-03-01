import React, { useContext, useState } from 'react';
import { Typography, TextField, Button, Container, Paper, Box } from '@mui/material';
import { addClusterDetails, getClusterDetails, getClusterDetailst } from '../../api/LoginApiService';
import { GlobalContext } from '../../global/globalContext/GlobalContext';
import { useNavigate } from 'react-router-dom';

const AddCluster = () => {
  const navigate = useNavigate();
    const {username,password}=useContext(GlobalContext);

  const [ClusterData, setClusterData] = useState({
    clusterUsername: '',
    clusterPassword: '',
    hostURL: '',
    clusterType: '',
    clusterName: '',
    openshiftClusterName: ''


  });
  const [errors, setErrors] = useState({
    clusterUsername: '',
    clusterPassword: '',
    hostURL: '',
    clusterType: '',
    clusterName: '',
    openshiftClusterName: ''
  });
  
  const handleChange = (e) => {
    setClusterData({
      ...ClusterData,
      [e.target.name]: e.target.value,
    });
    // Clear the error message when the user starts typing
    setErrors({
        ...errors,
        [e.target.name]: '',
      });
  };


  const handleSubmit =async (e) => {
    e.preventDefault();

    // Validate input fields
    const newErrors = {};
    Object.keys(ClusterData).forEach((key) => {
      if (!ClusterData[key]) {
        newErrors[key] = `Please fill in ${key==="clusterUsername"?"ClusterUserName":key==="clusterPassword"?"Password":key==="hostURL"?"HostURL":key==="clusterType"?"ClusterType":key==="clusterName"?"ClusterName":key==="openshiftClusterName"?"InfrastructureName":null} field`;
      }
    });

    // If there are errors, set the error state and prevent form submission
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const userDetails =JSON.parse(localStorage.getItem("userInfo")) ;
    // console.log("userDetails",userDetails);

 const ClusterPayload=   {
        username:userDetails.username,
        password:userDetails.password,
        roles:userDetails.roles,
        environments: [
          {
            clusterUsername: ClusterData.clusterUsername,
            clusterPassword: ClusterData.clusterPassword,
            hostUrl: ClusterData.hostURL,
            clusterType: ClusterData.clusterType,
            clusterName: ClusterData.clusterName,
            openshiftClusterName: ClusterData.openshiftClusterName
          }
        ]
      }
   await addClusterDetails(ClusterPayload);

    // Add your form submission logic here
    console.log('Form submitted:', ClusterPayload);
    navigate("/admin/adminMainpage")
  };




  return (
    <Container component="main" maxWidth="xs" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '90vh' }}>
      <Paper elevation={3} sx={{ padding: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h5" gutterBottom sx={{fontWeight:"bold"}}>
          Add Cluster
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', marginTop: 2 }}>
          <TextField
            label="Cluster Username"
            variant="outlined"
            fullWidth
            margin="normal"
            name="clusterUsername"
            value={ClusterData.clusterUsername}
            onChange={handleChange}
            required
            error={Boolean(errors.clusterUsername)}
            helperText={errors.clusterUsername}
          />
          <TextField
            label="Cluster Password"
            variant="outlined"
            fullWidth
            margin="normal"
            type="password"
            name="clusterPassword"
            value={ClusterData.clusterPassword}
            onChange={handleChange}
            required
            error={Boolean(errors.clusterPassword)}
            helperText={errors.clusterPassword}
          />
          <TextField
            label="Host URL"
            variant="outlined"
            fullWidth
            margin="normal"
            name="hostURL"
            value={ClusterData.hostURL}
            onChange={handleChange}
            required
            error={Boolean(errors.hostURL)}
            helperText={errors.hostURL}
          />
          <TextField
            label="Cluster Type"
            variant="outlined"
            fullWidth
            margin="normal"
            name="clusterType"
            value={ClusterData.clusterType}
            onChange={handleChange}
            required
            error={Boolean(errors.clusterType)}
            helperText={errors.clusterType}
          />
          <TextField
            label="Cluster Name"
            variant="outlined"
            fullWidth
            margin="normal"
            name="clusterName"
            value={ClusterData.clusterName}
            onChange={handleChange}
            required
            error={Boolean(errors.clusterName)}
            helperText={errors.clusterName}
          />
          <TextField
            label="Infrastructure Name"
            variant="outlined"
            fullWidth
            margin="normal"
            name="openshiftClusterName"
            value={ClusterData.openshiftClusterName}
            onChange={handleChange}
            required
            error={Boolean(errors.openshiftClusterName)}
            helperText={errors.openshiftClusterName}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ marginTop: 2,backgroundColor:"#091365",color:"white", "&:hover": { backgroundColor: "#091365" }, }} onClick={handleSubmit}>
            Submit
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default AddCluster;
