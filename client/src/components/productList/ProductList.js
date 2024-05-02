import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Button, Box } from '@mui/material';

function ProductList() {
  const [products, setProducts] = useState();

  useEffect(() => {
    axios.get('http://localhost:8080/api/products').then(function(res) {
      setProducts(res.data)
    })
  }, []);

  return (
    <div className="DetailForm">
        <Box>
          <Button><Link to={`/product/add`}>Add Product</Link></Button>
        </Box>
        {products?.map((product) => (
           <Box sx={{ p: 2, border: '1px dashed grey', minWidth: 400 }} key={product.name}>
            <div><Link to={`/product/${product.id}`}>{product.name}</Link></div>
            <div>Brand: {product.brand}</div>
            <div>Type: {product.type}</div>
           </Box>
        ))}
    </div>
  );
}

export default ProductList;
