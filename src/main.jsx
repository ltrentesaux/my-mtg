import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ImageModalProvider } from './contexts/ImageModalContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ImageModalProvider>
      <App />
    </ImageModalProvider>
  </React.StrictMode>
);
