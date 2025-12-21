import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { pluginRegistry } from './services/pluginRegistry';

// Registrar Marco CMS en el ecosistema GestasAI (opcional - Marco CMS funciona standalone)
// pluginRegistry.register();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
