import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import {
  FormControl,
  TextField,
  Button,
  Box,
  Snackbar,
  Alert
} from '@mui/material';

function DetailForm({ newProduct }) {
  const [productData, setProductData] = useState(null);
  const [isUniqueName, setIsUniqueName] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const { productId } = useParams();

  useEffect(() => {
    if (newProduct) {
      setProductData({
        name: '',
        brand: '',
        features: [],
        types: ['activewear', 'dress', 'footwear', 'outerwear', 'dress'],
        sizes: []
      });
    } else {
      axios.get(`http://localhost:8080/api/products/${productId}`)
        .then(res => setProductData(res.data))
        .catch(error => console.error('Error:', error));
    }
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
      setProductData(response.data);
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
    <div className="DetailForm" style={{ maxWidth: '1200px', margin: 'auto' }}>
      <Link to={"/"}>Back To Product List</Link>
      <Box sx={{ minWidth: 600 }}>
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
              labelId="product-type"
              id="product-type"
              label="Type"
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
    </div>
  );
}

export default DetailForm;
