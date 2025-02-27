import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signup } from '../api/api';
import Particle from './Particle';
import { Spinner } from 'react-bootstrap';
const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

    if (!username.trim()) {
      newErrors.username = 'Username is required';
    }

    if (!emailRegex.test(email)) {
      newErrors.email = 'Email must be a valid @gmail.com address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else {
      if (password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters long';
      } else if (!/[a-z]/.test(password)) {
        newErrors.password = 'Password must include at least one lowercase letter';
      } else if (!/[A-Z]/.test(password)) {
        newErrors.password = 'Password must include at least one uppercase letter';
      } else if (!/[!@#$%^&*]/.test(password)) {
        newErrors.password = 'Password must include at least one special character (!@#$%^&*)';
      }
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirm Password is required';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (validateForm()) {
      try {
        const { data } = await signup({ username, email, password, confirmPassword });
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.username);
        navigate('/login');
        setLoading(false);
      } catch (error) {
        alert('Signup failed: ' + (error.response?.data?.message || 'Unknown error'));
        setLoading(true);
        if (error.response?.data?.message) {
          setErrors({ backend: error.response.data.message });
        }
      }
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100 position-relative">
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
        <Particle />
      </div>
      <div
        className="card p-4 shadow-lg"
        style={{ maxWidth: '400px', width: '100%', zIndex: 2, background: 'rgba(255, 255, 255, 0.95)', borderRadius: '15px' }}
      >
        <div className="card-body">
          <h3 className="text-center mb-4">Sign up for SpendSmart</h3>
          {loading ? (
            <div className="d-flex justify-content-center align-items-center">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label fw-bold">Username</label>
              <input
                type="text"
                className={`form-control form-control-lg ${errors.username ? 'is-invalid' : ''}`}
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
              />
              {errors.username && <div className="invalid-feedback">{errors.username}</div>}
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label fw-bold">Email</label>
              <input
                type="email"
                className={`form-control form-control-lg ${errors.email ? 'is-invalid' : ''}`}
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                aria-describedby="emailHelp"
              />
              {errors.email && <div className="invalid-feedback">{errors.email}</div>}
              <div id="emailHelp" className="form-text text-muted">
                Must be a @gmail.com address.
              </div>
            </div>
            <div className="mb-3 position-relative">
              <label htmlFor="password" className="form-label fw-bold">Password</label>
              <div className="input-group">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className={`form-control form-control-lg ${errors.password ? 'is-invalid' : ''}`}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ borderLeft: 'none' }}
                >
                  <i className={showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'}></i>
                </button>
              </div>
              {errors.password && <div className="invalid-feedback">{errors.password}</div>}
            </div>
            <div className="mb-4 position-relative">
              <label htmlFor="confirmPassword" className="form-label fw-bold">Confirm Password</label>
              <div className="input-group">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  className={`form-control form-control-lg ${errors.confirmPassword ? 'is-invalid' : ''}`}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  required
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{ borderLeft: 'none' }}
                >
                  <i className={showConfirmPassword ? 'bi bi-eye-slash' : 'bi bi-eye'}></i>
                </button>
              </div>
              {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
              {errors.backend && <div className="alert alert-danger mt-2">{errors.backend}</div>}
            </div>
            <button type="submit" className="btn btn-primary btn-lg w-100 rounded-pill">
              Sign Up
            </button>
          </form>)}
        </div>
        <div className="card-footer text-center text-muted py-2">
          <small>
            Already have an account?{' '}
            <a href="/login" className="text-primary text-decoration-none">
              Login here
            </a>
          </small>
        </div>
      </div>
    </div>
  );
};

export default Signup;