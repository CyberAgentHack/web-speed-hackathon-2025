import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

// UnoCSS関連のインポートを追加
import '@unocss/reset/tailwind.css';
import 'virtual:uno.css';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root'),
);
