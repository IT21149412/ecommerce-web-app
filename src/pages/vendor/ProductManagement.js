import React, { useState, useEffect } from "react";
import {
  getProductsByVendor,
  createProduct,
  updateProduct,
  deleteProduct,
  activateProduct,    
  deactivateProduct
} from "../../services/ProductService";
import "./ProductManagement.scss";
import { useNavigate } from "react-router-dom";
import { getCategories } from "../../services/CategoryService";
import { jwtDecode } from 'jwt-decode';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: 0,
    stock: 0,
    isActive: true,
    categoryId: "",
    vendorId: "",
    imageUrl: "",
  });
  const [validationErrors, setValidationErrors] = useState({});  
  const [imageFile, setImageFile] = useState(null);
  const [editProduct, setEditProduct] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [categories, setCategories] = useState([]);
  const token = localStorage.getItem('token');
  let vendorId = null;
  
  if (token) {
    const decodedToken = jwtDecode(token);
    vendorId = decodedToken.nameid; 
    // console.log("decode",decodedToken)
  }

  const navigate = useNavigate();

  const viewProductDetails = (id) => {
    navigate(`/vendor/product/${id}`);
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories(); 
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await getProductsByVendor(vendorId);
      setProducts(response.data);
      setFilteredProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await getCategories();
      setCategories(response.data);   
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleImageUpload = (e) => {
    setImageFile(e.target.files[0]);
  };

  const validateProduct = (product) => {
    const errors = {};
    
    if (!product.name) {
      errors.name = "Product name is required";
    } else if (product.name.length < 3) {
      errors.name = "Product name must be at least 3 characters";
    }
  
    if (!product.description) {
      errors.description = "Product description is required";
    }
  
    if (product.price <= 0) {
      errors.price = "Price must be a positive number";
    }
  
    if (product.stock < 0) {
      errors.stock = "Stock cannot be a negative number";
    }
  
    return errors;
  };
  

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    const errors = validateProduct(newProduct);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {
      const productData = {
        name: newProduct.name,
        description: newProduct.description,
        price: newProduct.price,
        stock: newProduct.stock,
        isActive: newProduct.isActive,
        categoryId: newProduct.categoryId || "default-category-id",
        vendorId: newProduct.vendorId || "default-vendor-id",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
      };

      await createProduct(productData);
      fetchProducts();
      showAlert("Product added successfully!");
      closeModal();
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  const handleUpdateProduct = async (product) => {
    const errors = validateProduct(product);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {
      await updateProduct(product.id, product);
      fetchProducts();
      showAlert("Product updated successfully!");
      closeModal();
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const handleDeleteProduct = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (confirmDelete) {
      try {
        await deleteProduct(id);
        fetchProducts();
        showAlert("Product deleted successfully!");
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  const startEditProduct = (product) => {
    setEditProduct(product);
    setIsEditing(true);
    openModal();
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setNewProduct({
      name: "",
      description: "",
      price: 0,
      stock: 0,
      isActive: true,
      categoryId: "",
      vendorId: "",
      imageUrl: "",
    });
    setEditProduct(null);
    setImageFile(null);
    setIsEditing(false);
    setValidationErrors({});
  };

  const showAlert = (message) => {
    setAlertMessage(message);
    setTimeout(() => {
      setAlertMessage("");
    }, 3000);
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = products.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
    );
    setFilteredProducts(filtered);
  };


  const toggleProductStatus = async (product) => {
    try {
      if (product.isActive) {
        await deactivateProduct(product.id);  
      } else {
        await activateProduct(product.id);     
      }
      fetchProducts();  
      showAlert(`Product ${product.isActive ? 'deactivated' : 'activated'} successfully!`);
    } catch (error) {
      console.error("Error toggling product status:", error);
    }
  };

  return (
    <div className="vendor-product-management-container">
      <h2>Manage Products</h2>

      {alertMessage && <div className="alert-message">{alertMessage}</div>}

      <div className="search-bar-container">
        <input
          type="text"
          placeholder="Search by product name or description"
          value={searchQuery}
          onChange={handleSearch}
          className="search-bar"
        />
      </div>

      <button className="btn-primary open-modal-button" onClick={openModal}>
        Create New Product
      </button>

      <h3>Product List</h3>
      <table className="products-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Low Stock</th> 
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((product) => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{product.description}</td>
              <td>{product.price}</td>
              <td>{product.stock}</td>
              <td>{product.isLowStock ? 'Yes' : 'No'}</td> 
              <td className={product.isActive ? 'active-status' : 'deactivated-status'}>
                {product.isActive ? 'Active' : 'Deactivated'}
              </td>
              <td>
                {product.isActive ? (
                  <button className="btn-toggle-status deactivate" onClick={() => toggleProductStatus(product)}>
                    Deactivate
                  </button>
                ) : (
                  <button className="btn-toggle-status activate" onClick={() => toggleProductStatus(product)}>
                    Activate
                  </button>
                )}
                <button
                  className="icon-button"
                  onClick={() => startEditProduct(product)}
                >
                  <i className="fa fa-pencil"></i>
                </button>
                <button
                  className="icon-button"
                  onClick={() => handleDeleteProduct(product.id)}
                >
                  <i className="fa fa-trash"></i>
                </button>
                <button
                  className="icon-button"
                  onClick={() => viewProductDetails(product.id)}
                >
                  <i className="fa fa-eye"></i>
                </button> 
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-button" onClick={closeModal}>
              &times;
            </span>
            <h3>{isEditing ? "Edit Product" : "Create New Product"}</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (isEditing) {
                  handleUpdateProduct(editProduct);
                } else {
                  handleCreateProduct(e);
                }
              }}
            >
              {/* Image Upload Section */}
              <div className="form-group image-upload">
                <label>Item Information</label>
                <div className="image-preview">
                  {imageFile ? (
                    <img src={URL.createObjectURL(imageFile)} alt="Product" />
                  ) : (
                    <p>Browse Images</p>
                  )}
                </div>
                <input
                  type="file"
                  name="image"
                  onChange={handleImageUpload}
                  className="form-control"
                />
              </div>

              {/* Product Details Fields */}
              <div className="form-fields">
                <div className="form-group">
                  <label>Product Name*</label>
                  <input
                    type="text"
                    name="name"
                    value={isEditing ? editProduct.name : newProduct.name}
                    onChange={(e) =>
                      isEditing
                        ? setEditProduct({
                            ...editProduct,
                            name: e.target.value,
                          })
                        : handleInputChange(e)
                    }
                    required
                    className="form-control"
                  />
                  {validationErrors.name && (
                    <p className="error">{validationErrors.name}</p>
                  )}
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    name="description"
                    value={
                      isEditing
                        ? editProduct.description
                        : newProduct.description
                    }
                    onChange={(e) =>
                      isEditing
                        ? setEditProduct({
                            ...editProduct,
                            description: e.target.value,
                          })
                        : handleInputChange(e)
                    }
                    required
                    className="form-control"
                  />
                  {validationErrors.description && (
                    <p className="error">{validationErrors.description}</p>
                  )}
                </div>

                <div className="form-group">
                  <label>Price*</label>
                  <input
                    type="number"
                    name="price"
                    value={isEditing ? editProduct.price : newProduct.price}
                    onChange={(e) =>
                      isEditing
                        ? setEditProduct({
                            ...editProduct,
                            price: e.target.value,
                          })
                        : handleInputChange(e)
                    }
                    required
                    className="form-control"
                  />
                  {validationErrors.price && (
                    <p className="error">{validationErrors.price}</p>
                  )}
                </div>

                <div className="form-group">
                  <label>Stock*</label>
                  <input
                    type="number"
                    name="stock"
                    value={isEditing ? editProduct.stock : newProduct.stock}
                    onChange={(e) =>
                      isEditing
                        ? setEditProduct({
                            ...editProduct,
                            stock: e.target.value,
                          })
                        : handleInputChange(e)
                    }
                    required
                    className="form-control"
                  />
                  {validationErrors.stock && (
                    <p className="error">{validationErrors.stock}</p>
                  )}
                </div>
              </div>
              <div className="form-group">
                <label>Category*</label>
                <select
                  name="categoryId"
                  value={newProduct.categoryId}
                  onChange={handleInputChange}
                  required
                  className="form-control"
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {validationErrors.categoryId && (
                  <p className="error">{validationErrors.categoryId}</p>
                )}
              </div>
              {/* Form Actions */}
              <div className="form-actions">
                <button type="submit" className="btn-primary">
                  {isEditing ? "Update Product" : "Create Product"}
                </button>
                <button
                  type="reset"
                  className="btn-secondary"
                  onClick={closeModal}
                >
                  Reset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
