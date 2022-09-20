import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
// We disabled strict mode as it would cause
// the WA chat to re-render in local development
root.render(<App />);

reportWebVitals();
