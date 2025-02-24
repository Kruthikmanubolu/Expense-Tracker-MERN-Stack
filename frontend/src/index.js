import React from 'react';

import ReactDOM from 'react-dom/client'; // Note the '/client' import

import App from './App';
import 'bootstrap/dist/css/bootstrap.css';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);