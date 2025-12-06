import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from './contexts/ThemeContext.jsx'

import { pluginRegistry } from './services/pluginRegistry.js';

// Inicializar registro del plugin
pluginRegistry.register().then(() => {
  // Iniciar latido cada 30 segundos si el registro fue exitoso
  // Nota: Aunque falle, la app debe cargar igual
  setInterval(() => {
    pluginRegistry.heartbeat();
  }, 30000);
}).catch(console.error);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
)
