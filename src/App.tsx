import React from 'react';
import { BrowserRouter as Router, useRoutes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './contexts/ThemeContext';
import { appRoutes } from './routes';

const AppRoutes = () => {
  const routing = useRoutes(appRoutes);
  return routing;
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <Toaster
        position="top-center"
        toastOptions={{
          success: {
            style: {
              background: '#10B981',
              color: 'white',
            },
          },
          error: {
            style: {
              background: '#EF4444',
              color: 'white',
            },
          },
          style: {
            background: '#3B82F6',
            color: 'white',
          },
        }}
      />

      <Router>
        <AppRoutes />
      </Router>
    </ThemeProvider>
  );
};

export default App;