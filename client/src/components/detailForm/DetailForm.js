import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
  FormControl,
  InputLabel,
  Select,
  Autocomplete,
  TextField,
  Button,
  MenuItem,
  Box,
  Chip,
  Snackbar,
  Alert
} from '@mui/material';

function DetailForm({ newProduct }) {
  const [productData, setProductData] = useState();
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
      axios.get(`http://localhost:8080/api/products/${productId}`).then(function(res) {
        setProductData(res.data);
      });
    }
  }, []);

  const handleChange = (field, value) => {
    setProductData(prevState => ({
      ...prevState,
      [field]: value
    }));
  }

  const handleNameChange = async (field, value) => {
    handleChange(field, value);
    try {
      const response = await axios.post(`http://localhost:8080/api/validate`, {
        id: productData.id,
        name: value
      });
      setIsUniqueName(true);
    } catch (error) {
      if (error.response.data.error.issues.find((issue) => issue.message === "Name must be unique")) {
        setIsUniqueName(false);
      }
    }
  }

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
    return (<div>Loading</div>)
  }

  return (
    <div className="DetailForm" style={{ maxWidth: '1200px', margin: 'auto' }}>
        <Box sx={{ minWidth: 600 }}>
          <form onSubmit={handleSubmit}>
            <FormControl fullWidth sx={{margin: '10px'}}>
              <TextField 
                error={!isUniqueName}
                id="product-name" 
                label="Name" 
                variant="standard" 
                value={productData.name} 
                onChange={(event) => handleNameChange('name', event.target.value)}
                helperText={!isUniqueName && 'Must be a unique name' }
              />
            </FormControl>

            <FormControl fullWidth sx={{margin: '10px'}}>
              <TextField
                readOnly
                labelId="product-type"
                id="product-type"
                label="Type"
                value={productData.type}
                />
            </FormControl>
            <FormControl fullWidth sx={{margin: '10px'}}>
              <Autocomplete
                multiple
                readOnly
                id="product-size"
                options={productData.sizes.map((option) => option.title)}
                defaultValue={[...productData.sizes]}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip variant="filled" label={option} {...getTagProps({ index })} />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    readOnly
                    label="Sizes"
                  />
                )}
              />
            </FormControl>
            <FormControl fullWidth sx={{margin: '10px'}}>
              <Autocomplete
                multiple
                readOnly
                id="features"
                options={productData.features.map((option) => option.title)}
                defaultValue={[...productData.features]}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip variant="filled" label={option} {...getTagProps({ index })} />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    readOnly
                    label="Features"
                  />
                )}
              />
            </FormControl>
            <FormControl fullWidth sx={{margin: '10px'}}>
              <TextField 
                readOnly
                id="product-brand" 
                label="Brand" 
                variant="standard" 
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
