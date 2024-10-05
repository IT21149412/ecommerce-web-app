import React, { useState, useEffect } from 'react';
import { getProductById } from '../../services/ProductService';
import { useParams } from 'react-router-dom';
import './ProductDetails.scss';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      const response = await getProductById(id);
      setProduct(response.data);
    } catch (error) {
      console.error('Error fetching product details:', error);
    }
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="product-details-container">
      <h2>{product.name}</h2>
      
      <div className="details-content">
        {/* Left Section - Product Image */}
        <div className="left-section">
          <div className="product-info">
            {product.imageUrl ? (
              <img src={product.imageUrl} alt={product.name} className="product-image" />
            ) : (
              <p>No Image Available</p>
            )}
          </div>
        </div>

        {/* Right Section - Product Details */}
        <div className="right-section">
          <div className="product-info">
            <p><strong>ID:</strong> {product.id}</p>
            <p><strong>Price:</strong> ${product.price}</p>
            <p><strong>Stock:</strong> {product.stock}</p>
            <p><strong>Status:</strong> {product.isActive ? 'Active' : 'Deactivated'}</p>
            <p><strong>Low Stock:</strong> {product.isLowStock ? 'Yes' : 'No'}</p>
            <p><strong>Created At:</strong> {new Date(product.createdAt).toLocaleString()}</p>
            <p><strong>Last Updated:</strong> {new Date(product.lastUpdated).toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div className="description product-info">
        <h3>Description</h3>
        <p>{product.description || 'No description available.'}</p>
      </div>
    </div>
  );
};

export default ProductDetails;
