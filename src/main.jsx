import React from 'react';
import ReactDOM from 'react-dom/client';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ReviewProvider } from './context/ReviewContext';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <ThemeProvider>
        <ReviewProvider>
          <App />
        </ReviewProvider>
      </ThemeProvider>
    </AuthProvider>
  </React.StrictMode>
);
