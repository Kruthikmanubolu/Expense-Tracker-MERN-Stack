import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signup } from '../api/api';
import Particle from './Particle';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await signup({ username, email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', data.username);
      navigate('/dashboard');
    } catch (error) {
      alert('Signup failed: ' + (error.response?.data?.message || 'Unknown error'));
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <Particle></Particle>
      <div className="card p-4 shadow-lg" style={{ maxWidth: '400px', width: '100%' }}>
        <div className="card-header bg-primary text-white text-center py-3">
          <h3 className="mb-0">Get Started</h3>
          <small>Sign up for Expense Tracker</small>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label fw-bold">Username</label>
              <input
                type="text"
                className="form-control form-control-lg"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
              />
            </div>
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
              Sign Up
            </button>
          </form>
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