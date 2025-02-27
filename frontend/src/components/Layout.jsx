import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const Layout = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <header className="bg-primary text-white text-center py-3">
        <h1 className="mb-0">SpendSmart</h1>
      </header>
      <main className="flex-grow-1">
        <Outlet /> 
      </main>
    </div>
  );
};

export default Layout;