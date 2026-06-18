import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { QuoteProvider } from "./contexts/QuoteContext";
import './index.css'

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QuoteProvider>
      <App />
    </QuoteProvider>
  </React.StrictMode>
);