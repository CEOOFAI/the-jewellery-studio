import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { PricesProvider } from "./contexts/PricesContext";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <PricesProvider>
        <App />
      </PricesProvider>
    </BrowserRouter>
  </StrictMode>
);
