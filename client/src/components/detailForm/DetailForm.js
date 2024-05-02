import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  FormControl,
  TextField,
  Button,
  Box,
  Snackbar,
  Alert,
  Toolbar
} from '@mui/material';

function DetailForm({ newProduct }) {
  const [productData, setProductData] = useState(null);
  const [isUniqueName, setIsUniqueName] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const { productId } = useParams();

  useEffect(() => {
    axios.get(`http://localhost:8080/api/products/${productId}`)
      .then(res => setProductData(res.data))
      .catch(error => console.error('Error:', error));
  }, []);

  const handleChange = (field, value) => {
    setProductData(prevState => ({
      ...prevState,
      [field]: value
    }));
  };

  const handleNameChange = async (value) => {
    handleChange('name', value);
    try {
      await axios.post(`http://localhost:8080/api/validate`, {
        id: productData.id,
        name: value
      });
      setIsUniqueName(true);
    } catch (error) {
      if (error.response?.data?.error?.issues?.some(issue => issue.message === "Name must be unique")) {
        setIsUniqueName(false);
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.put(`http://localhost:8080/api/products/${productData.id}`, productData);
      setIsSuccess(true);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleCloseSuccess = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setIsSuccess(false);
  };

  if (!productData) {
    return (<div>Loading</div>);
  }

  return (
    <Container maxWidth="md" className="DetailForm">
        <Toolbar>
          <Link to={"/"}>Back To Product List</Link>
        </Toolbar>
      <Box sx={{ margin: '20px 0' }}>
        <form onSubmit={handleSubmit}>
          <FormControl fullWidth sx={{ margin: '10px' }}>
            <TextField
              error={!isUniqueName}
              id="product-name"
              label="Name"
              variant="standard"
              value={productData.name}
              onChange={(event) => handleNameChange(event.target.value)}
              helperText={!isUniqueName && 'Must be a unique name'}
            />
          </FormControl>

          <FormControl fullWidth sx={{ margin: '10px' }}>
            <TextField
              readOnly
              label="product-type"
              id="product-type"
              value={productData.type}
            />
          </FormControl>

          <FormControl fullWidth sx={{ margin: '10px' }}>
            <TextField
              readOnly
              id="product-size"
              label="Sizes"
              value={productData.sizes.join(', ')}
            />
          </FormControl>

          <FormControl fullWidth sx={{ margin: '10px' }}>
            <TextField
              readOnly
              id="features"
              label="Features"
              value={productData.features.join(', ')}
            />
          </FormControl>

          <FormControl fullWidth sx={{ margin: '10px' }}>
            <TextField
              readOnly
              id="product-brand"
              label="Brand"
              value={productData.brand}
            />
          </FormControl>

          <FormControl>
            <Button type="submit">Save</Button>
          </FormControl>
        </form>
      </Box>
      <Snackbar open={isSuccess} autoHideDuration={6000} onClose={handleCloseSuccess}>
        <Alert onClose={handleCloseSuccess} severity="success" sx={{ width: '100%' }}>
          Product saved successfully!
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default DetailForm;
