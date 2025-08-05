import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./app/store";
import { Toaster } from "react-hot-toast";

import App from "./App";
import "./index.css";

// Get the root element from the public/index.html file
const root = ReactDOM.createRoot(document.getElementById("root"));

// Render the main application
root.render(
  <React.StrictMode>
    {/* Make the Redux store available to the entire app */}
    <Provider store={store}>
      {/* Enable client-side routing */}
      <BrowserRouter>
        <App />
        {/* Component for displaying toast notifications globally */}
        <Toaster
          position="top-right"
          reverseOrder={false}
          toastOptions={{
            // Define default options
            className: "",
            style: {
              background: "#2c2c2c",
              color: "#e5e7eb",
            },
          }}
        />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
