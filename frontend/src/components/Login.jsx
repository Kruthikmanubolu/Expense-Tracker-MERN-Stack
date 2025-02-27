import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/api';
import Particle from './Particle';
import { Spinner } from 'react-bootstrap';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await login({ email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', data.username);
      setLoading(false);
      navigate('/dashboard');
    } catch (error) {
      setLoading(false);
      alert('Login failed: ' + (error.response?.data?.message || 'Unknown error'));
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100 position-relative">
      <Particle />
      <div
        className="card p-4 shadow-lg"
        style={{ maxWidth: '400px', width: '100%', zIndex: 2, background: 'rgba(255, 255, 255, 0.95)', borderRadius: '15px' }}
      >
        <div className="card-body">
          {loading ? (
            <div className="d-flex justify-content-center align-items-center">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <h3 className="text-center mb-4">Login to SpendSmart</h3> {/* Optional: Reference "SpendSmart" */}
              <div className="mb-3">
                <label htmlFor="email" className="form-label fw-bold">Email</label>
                <input
                  type="email"
                  className="form-control form-control-lg"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  aria-describedby="emailHelp"
                />
                <div id="emailHelp" className="form-text text-muted">
                  We'll never share your email.
                </div>
              </div>
              <div className="mb-4">
                <label htmlFor="password" className="form-label fw-bold">Password</label>
                <input
                  type="password"
                  className="form-control form-control-lg"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary btn-lg w-100 rounded-pill">
                Login
              </button>
            </form>
          )}
        </div>
        <div className="card-footer text-center text-muted py-2">
          <small>
            Don’t have an account?{' '}
            <a href="/signup" className="text-primary text-decoration-none">
              Sign up here
            </a>
          </small>
        </div>
      </div>
    </div>
  );
};

export default Login;