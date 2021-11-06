import React from "react";
import ReactDOM from "react-dom";

import Router from "./Router";
import AuthProvider from "context/auth";

import "./index.css";

const root = document.getElementById("root");

if (!root) {
  throw new Error("Must have a root element to render the application to.");
}

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <AuthProvider>
      <Router />
    </AuthProvider>
  </React.StrictMode>
);
