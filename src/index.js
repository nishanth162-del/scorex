import React from 'react';
import ReactDOM from 'react-dom/client'; // Note the import from 'react-dom/client'
import App from './App';
import AuthProvider from "./AuthContext";
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root')); // Create a root
root.render(  // Use render method on the root
  <AuthProvider>
  <React.StrictMode>
    <App />
  </React.StrictMode>
  </AuthProvider>
);
