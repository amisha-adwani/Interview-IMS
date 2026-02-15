import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import store from './store';
import App from './App';

// Inline Tailwind CSS to avoid import issues
const tailwindCSS = `
@tailwind base;
@tailwind components;
@tailwind utilities;
`;

const style = document.createElement('style');
style.textContent = tailwindCSS;
document.head.appendChild(style);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
