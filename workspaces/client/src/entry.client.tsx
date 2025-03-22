import React from "react";
import ReactDOM from "react-dom/client";
import { HydratedRouter } from "react-router/dom";

// eslint-disable-next-line import/no-unresolved
import 'virtual:uno.css';
import '@unocss/reset/tailwind-compat.css';

ReactDOM.hydrateRoot(
  document,
  <React.StrictMode>
    <HydratedRouter />
  </React.StrictMode>
);
