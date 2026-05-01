import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { SettingsProvider } from './context/SettingsContext.tsx';
import { AuthProvider } from './context/AuthContext.tsx';
import ToastContainer from './components/ToastContainer.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SettingsProvider>
      <AuthProvider>
        <App />
        <ToastContainer />
      </AuthProvider>
    </SettingsProvider>
  </StrictMode>,
);
