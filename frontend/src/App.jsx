import React from "react";
import { Routes, Route } from "react-router-dom";

// Import Layout & Common Components
import Header from "./components/layout/Header";
import PrivateRoute from "./components/PrivateRoute";
import AdminRoute from "./components/AdminRoute";

// Import Pages
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
// --- Placeholder Pages ---
const OrderPage = () => <div className="p-8 text-center">Order Page (WIP)</div>;
const CartPage = () => <div className="p-8 text-center">Cart Page (WIP)</div>;
const UserDashboardPage = () => (
  <div className="p-8 text-center">User Dashboard (WIP)</div>
);
const AdminDashboardPage = () => (
  <div className="p-8 text-center">Admin Dashboard (WIP)</div>
);

function App() {
  return (
    <div className="bg-dark-primary min-h-screen">
      <Header />
      <main>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/order" element={<OrderPage />} />
          <Route path="/cart" element={<CartPage />} />

          {/* Private User Routes */}
          <Route path="" element={<PrivateRoute />}>
            <Route path="/dashboard" element={<UserDashboardPage />} />
            {/* Add more private routes here like /profile, /order-history */}
          </Route>

          {/* Private Admin Routes */}
          <Route path="" element={<AdminRoute />}>
            <Route path="/admin" element={<AdminDashboardPage />} />
            {/* Add more admin routes here like /admin/products, /admin/users */}
          </Route>
        </Routes>
      </main>
    </div>
  );
}

export default App;
