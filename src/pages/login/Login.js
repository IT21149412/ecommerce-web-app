import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';  
import { loginUser } from '../../services/AuthService';
import './Login.scss';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { user, login } = useContext(AuthContext);  
  const navigate = useNavigate();

  // Redirect if the user is already logged in
  useEffect(() => {
    if (user) {
      if (user.role === 'Administrator') {
        navigate('/admin/dashboard');
      } else if (user.role === 'Vendor') {
        navigate('/vendor/dashboard');
      } else if (user.role === 'CSR') {
        navigate('/csr/dashboard');
      }
    }
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser({ email, password });
      const { token, role } = response;

      // Save the token and role in the AuthContext
      login({ token, role });

      // Redirect after successful login based on role
      if (role === 'Administrator') {
        navigate('/admin/dashboard');
      } else if (role === 'Vendor') {
        navigate('/vendor/dashboard');
      } else if (role === 'CSR') {
        navigate('/csr/dashboard');
      } else {
        setError('Invalid role.');
      }
    } catch (err) {
      setError('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="login-container">
      <div className="row">
        <div className="col-md-6 p-0">
          <img
            src={require('../../assets/images/login_img.jpg')}
            alt="Login Visual"
            className="img-fluid h-100 login-image"
          />
        </div>
        <div className="col-md-6 form-container">
          <form onSubmit={handleLogin}>
            <h2>Login</h2>
            {error && <p>{error}</p>}
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="btn">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
