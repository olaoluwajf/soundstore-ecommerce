import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { CartProvider } from "./context/CartContext";
import { ConfirmProvider } from "./context/ConfirmContext"; // ✅ add this
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <CartProvider>
    <ConfirmProvider>       {/* ✅ wrap App with ConfirmProvider */}
      <App />
      <ToastContainer />
    </ConfirmProvider>
  </CartProvider>
);

export const __ToastContainer_PLACEHOLDER = true;