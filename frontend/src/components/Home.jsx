import React from 'react';
import { Link } from 'react-router-dom';
import Particle from './Particle';

const Home = () => {
  return (
    <div
      className="container d-flex flex-column justify-content-center align-items-center min-vh-100"
      style={{
        background: 'linear-gradient(135deg, #6e48aa, #9d50bb, #e55d87)',
        backgroundSize: '400% 400%',
        animation: 'gradientShift 15s ease infinite',
      }}
    >
      <style>
        {`
          @keyframes gradientShift {
            0% { background-position: 0% 0%; }
            50% { background-position: 100% 100%; }
            100% { background-position: 0% 0%; }
          }
          .fancy-button {
            padding: 12px 24px;
            font-size: 1.25rem;
            font-weight: bold;
            border-radius: 25px;
            border: none;
            cursor: pointer;
            transition: transform 0.3s ease, background-color 0.3s ease;
            margin: 10px;
            width: 200px;
          }
          .fancy-button:hover {
            transform: translateY(-5px);
            background-color: #ffffff !important;
            color: #007bff !important;
          }
          .fancy-button:focus {
            outline: none;
            box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.3);
          }
        `}
      </style>
      <div className="text-center text-white mb-5" style={{ zIndex: 2 }}>
        <h1 className="display-3 fw-bold mb-3">SpendSmart</h1>
        <p className="lead mb-5">
          Manage your expenses smartly and save effortlessly with SpendSmart—your ultimate financial tracking tool!
        </p>
        <div className="d-flex justify-content-center">
          <Link to="/login" className="btn fancy-button btn-primary text-white">
            Login
          </Link>
          <Link to="/signup" className="btn fancy-button btn-primary text-white">
            Sign Up
          </Link>
        </div>
      </div>
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}>
        <Particle />
      </div>
    </div>
  );
};

export default Home;