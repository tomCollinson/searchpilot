import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
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

const options = {
  sizes: {
    footwear: ['US 7', 'US 8', 'US 9', 'US 10'],
    clothing: ['M', 'L', 'XL'],
  },
  types: [
    "activewear",
    "dress",
    "footwear",
    "outerwear",
    "top"
  ],
  brands: [
    "Aerowear",
    "ChicStyles",
    "Eleganza",
    "ExtremeGear",
    "FitFlex",
    "OutfitMakers",
    "RunXpert",
    "UrbanSteps",
    "WeatherProtectors",
    "YogaEssentials",
  ],
  features: [
    "Adjustable cuffs",
    "Breathable fabric",
    "Breathable mesh upper",
    "Breathable",
    "Canvas material",
    "Cushioned insole",
    "Floor-length",
    "Floral pattern",
    "Flowing fabric",
    "High-waisted",
    "Hood with drawstrings",
    "Inner pocket",
    "Insulated for warmth",
    "Kangaroo pocket",
    "Lightweight and airy",
    "Medium support",
    "Moisture-wicking fabric",
    "Multiple pockets",
    "Racerback design",
    "Removable hood",
    "Round neck",
    "Rubber sole",
    "Shock-absorbing sole",
    "Short sleeves",
    "Spaghetti straps",
    "Stretchy and comfortable",
    "V-neckline",
    "Versatile design",
    "Warm and cozy",
    "Waterproof",
  ]
}

function NewForm({ newProduct }) {
  const { productId } = useParams();
  const [productData, setProductData] = useState({
    name: '',
    brand: '',
    features: options.features,
    sizes: [],
    type: '',
    style: '',
    colour: '',
    neckline: ''
  });
  const [isUniqueName, setIsUniqueName] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [sizeType, setSizeType] = useState('clothing');

  const handleChange = (field, value) => {
    setProductData(prevState => ({
      ...prevState,
      [field]: value
    }));
  }

  const handleTypeChange = (field, value) => {

    value === 'footwear' ? setSizeType('footwear') : setSizeType('clothing');

    setProductData(prevState => ({
      ...prevState,
      type: value
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
      const isNameUnique = error.response.data.error.issues.find(issue => issue.message === "Name must be unique");
      if (isNameUnique) {
        setIsUniqueName(false);
      }
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(`http://localhost:8080/api/products`, productData);
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
              onChange={(event) => handleNameChange('name', event.target.value)}
              helperText={!isUniqueName && 'Must be a unique name'}
            />
          </FormControl>

          <FormControl fullWidth sx={{ margin: '10px' }}>
            <Select
              labelId="product-type"
              id="product-type"
              value={productData.type}
              label="Type"
              onChange={(event) => handleTypeChange('type', event.target.value)}
            >
              {options.types.map((option) => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
            </Select>
          </FormControl>

          {productData.type && (
            <>
              <FormControl fullWidth sx={{ margin: '10px' }}>
                <Autocomplete
                  multiple
                  id="product-size"
                  options={options.sizes[sizeType]}
                  getOptionLabel={(option) => option}
                  onChange={(event, selectedValues) => handleChange('sizes', selectedValues)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="standard"
                      label="Sizes"
                    />
                  )}
                />
              </FormControl>

              <FormControl fullWidth sx={{ margin: '10px' }}>
                <Autocomplete
                  multiple
                  id="product-features"
                  options={options.features}
                  getOptionLabel={(option) => option}
                  onChange={(event, selectedValues) => handleChange('features', selectedValues)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="standard"
                      label="Features"
                    />
                  )}
                />
              </FormControl>

              {productData.type === 'top' && 
                <FormControl fullWidth sx={{ margin: '10px' }}>
                <TextField
                  id="product-neckline"
                  label="Neckline"
                  variant="standard"
                  value={productData.neckline}
                  onChange={(event) => handleChange('neckline', event.target.value)}
                />
              </FormControl>
              }

              {productData.type === 'dress' && 
                <FormControl fullWidth sx={{ margin: '10px' }}>
                <TextField
                  id="product-colour"
                  label="Colour"
                  variant="standard"
                  value={productData.colour}
                  onChange={(event) => handleChange('colour', event.target.value)}
                />
              </FormControl>
              }

              <FormControl fullWidth sx={{ margin: '10px' }}>
                <Select
                  labelId="product-brand"
                  id="product-brand"
                  value={productData.brand}
                  label="Brand"
                  onChange={(event) => handleChange('brand', event.target.value)}
                >
                  {options.brands.map((option) => (
                    <MenuItem key={option} value={option}>{option}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </>
          )}

          <FormControl>
            <Button type="submit">Save</Button>
          </FormControl>
        </form>
      </Box>
      <Snackbar open={isSuccess} autoHideDuration={6000} onClose={handleCloseSuccess}>
        <Alert onClose={handleCloseSuccess} severity="success" sx={{ width: '100%' }}>
          Form submitted successfully!
        </Alert>
      </Snackbar>
    </div>
  );
}

export default NewForm;
