import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App.jsx';
import { AuthProvider } from './contexts/AuthContext.jsx';
import { ThemeProvider } from './contexts/ThemeContext.jsx';
import SetupRequired from './pages/SetupRequired.jsx';
import { hasSupabaseConfig } from './lib/supabase.js';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        {hasSupabaseConfig ? (
          <AuthProvider>
            <App />
            <Toaster position="top-center" toastOptions={{ duration: 3500 }} />
          </AuthProvider>
        ) : (
          <SetupRequired />
        )}
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
