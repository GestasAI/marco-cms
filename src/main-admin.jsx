import React from 'react';
import ReactDOM from 'react-dom/client';
import AdminApp from './AdminApp';
import pluginRegistry from './services/pluginRegistry';

// Dashboard specific global initializations
pluginRegistry.register();

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <AdminApp />
    </React.StrictMode>
);
