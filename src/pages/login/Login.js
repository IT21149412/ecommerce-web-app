import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';  
import { loginUser } from '../../services/AuthService';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);  
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser({ email, password });  // Call login API and get token and role
      const { token, role } = response;  // Extract token and role from the API response

      // Save the token and role in the AuthContext
      login({ token, role }); 
      
      console.log('User role:', role);
      console.log('Redirecting to:', role === 'Administrator' ? '/admin/dashboard' : role === 'Vendor' ? '/vendor/dashboard' : '/csr/dashboard');


      // Use `navigate` function to redirect after successful login based on role
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
    <div>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleLogin}>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
