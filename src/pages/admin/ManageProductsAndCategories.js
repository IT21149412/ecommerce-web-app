import React, { useState, useEffect } from 'react';
import { 
  getCategories, 
  getProducts, 
  createCategory, 
  activateCategory, 
  deactivateCategory, 
  activateProduct, 
  deactivateProduct 
} from '../../services/ProductCategoryService';

import { getUsers } from '../../services/UserService';  // Importing from UserService
import './ManageProductsAndCategories.scss';

const ManageProductsCategories = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [vendors, setVendors] = useState([]); // State for vendors
  const [activeTab, setActiveTab] = useState('products'); // To toggle between products and categories
  const [lowStockView, setLowStockView] = useState(false); // Toggle for Low Stock view
  const [newCategory, setNewCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    fetchCategories();
    fetchProducts();
    fetchVendors(); // Fetch the users to get vendor names
  }, []);

  // Fetch all categories
  const fetchCategories = async () => {
    try {
      const response = await getCategories();
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  // Fetch all products
  const fetchProducts = async () => {
    try {
      const response = await getProducts();
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  // Fetch all vendors (users)
  const fetchVendors = async () => {
    try {
      const response = await getUsers(); // Fetch users who are vendors
      setVendors(response.data);
    } catch (error) {
      console.error('Error fetching vendors:', error);
    }
  };

  // Create a new category
  const handleCreateCategory = async () => {
    if (!newCategory) {
      showAlert('Category name is required.');
      return;
    }
    try {
      await createCategory({ name: newCategory });
      fetchCategories();
      showAlert('Category created successfully!');
      setNewCategory('');
    } catch (error) {
      console.error('Error creating category:', error);
    }
  };

  // Activate/Deactivate Category
  const handleToggleCategoryStatus = async (category) => {
    if (category.isActive) {
      await deactivateCategory(category.id);
      showAlert('Category deactivated successfully!');
    } else {
      await activateCategory(category.id);
      showAlert('Category activated successfully!');
    }
    fetchCategories();
  };

  // Activate/Deactivate Product
  const handleToggleProductStatus = async (product) => {
    if (product.isActive) {
      await deactivateProduct(product.id);
      showAlert('Product deactivated successfully!');
    } else {
      await activateProduct(product.id);
      showAlert('Product activated successfully!');
    }
    fetchProducts();
  };

  // Handle Notify Vendor button click
  const handleNotifyVendor = () => {
    showAlert('Notification Sent to Vendor!');
  };

  const showAlert = (message) => {
    setAlertMessage(message);
    setTimeout(() => {
      setAlertMessage('');
    }, 3000);
  };

  // Filter products by search query
  const filteredProducts = products.filter((product) => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    categories.find(category => category.id === product.categoryId)?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter categories by search query
  const filteredCategories = categories.filter((category) => 
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get vendor name by product's vendorId
  const getVendorName = (vendorId) => {
    const vendor = vendors.find(v => v.id === vendorId);
    return vendor ? vendor.name : 'Unknown';
  };

  // Get category name by product's categoryId
  const getCategoryName = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : 'Unknown';
  };

  // Filter Low Stock Products
  const lowStockProducts = products.filter((product) => product.stock < 5);

  return (
    <div className="manage-products-categories-container">
      <h2>Manage Products and Categories</h2>

      {alertMessage && <div className="alert-message">{alertMessage}</div>}

      {/* Toggle between Products and Categories */}
      <div className="tab-toggle-container">
        <div
          className={`tab-toggle ${activeTab === 'products' ? 'active-tab-toggle' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          Products
        </div>
        <div
          className={`tab-toggle ${activeTab === 'categories' ? 'active-tab-toggle' : ''}`}
          onClick={() => setActiveTab('categories')}
        >
          Categories
        </div>
      </div>

      <div className="search-filter-container">
        <input
          type="text"
          placeholder="Search by name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-bar"
        />
        {activeTab === 'products' && (
          <button 
            className={`low-stock-toggle ${lowStockView ? 'active-low-stock' : ''}`} 
            onClick={() => setLowStockView(!lowStockView)}
          >
            {lowStockView ? 'View All Products' : 'Low Stock Products'}
          </button>
        )}
      </div>

      {/* Products Table */}
      {activeTab === 'products' && (
        <div>
          <h3>{lowStockView ? 'Low Stock Products' : 'Product List'}</h3>
          <table className="products-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Category</th>
                <th>Vendor</th> {/* Add Vendor column */}
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {(lowStockView ? lowStockProducts : filteredProducts).map((product) => (
                <tr key={product.id} className={product.stock < 5 ? 'low-stock' : ''}>
                  <td>{product.name}</td>
                  <td>{product.description}</td>
                  <td>{product.price}</td>
                  <td>{product.stock}</td>
                  <td>{getCategoryName(product.categoryId)}</td> {/* Display category name */}
                  <td>{getVendorName(product.vendorId)}</td> {/* Display vendor name */}
                  <td className={product.isActive ? 'active-status' : 'deactivated-status'}>
                    {product.isActive ? 'Active' : 'Deactivated'}
                  </td>
                  <td>
                    {product.isActive ? (
                      <button className="btn-toggle-status deactivate" onClick={() => handleToggleProductStatus(product)}>
                        Deactivate
                      </button>
                    ) : (
                      <button className="btn-toggle-status activate" onClick={() => handleToggleProductStatus(product)}>
                        Activate
                      </button>
                    )}
                    {product.stock < 5 && (
                      <button className="btn-notify-vendor" onClick={handleNotifyVendor}>Notify vendor of low stock</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Categories Table */}
      {activeTab === 'categories' && (
        <div>
          <h3>Category List</h3>
          <div className="create-category">
            <input
              type="text"
              placeholder="Enter category name"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="category-input"
            />
            <button className="btn-create-category" onClick={handleCreateCategory}>
              Create Category
            </button>
          </div>

          <table className="categories-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.map((category) => (
                <tr key={category.id}>
                  <td>{category.name}</td>
                  <td className={category.isActive ? 'active-status' : 'deactivated-status'}>
                    {category.isActive ? 'Active' : 'Deactivated'}
                  </td>
                  <td>
                    {category.isActive ? (
                      <button className="btn-toggle-status deactivate" onClick={() => handleToggleCategoryStatus(category)}>
                        Deactivate
                      </button>
                    ) : (
                      <button className="btn-toggle-status activate" onClick={() => handleToggleCategoryStatus(category)}>
                        Activate
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageProductsCategories;
