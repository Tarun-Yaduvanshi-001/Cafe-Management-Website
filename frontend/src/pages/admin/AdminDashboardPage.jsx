import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  BarChart2,
} from "lucide-react";

const AdminDashboardPage = () => {
  const navLinkClass = ({ isActive }) =>
    `flex items-center px-4 py-3 rounded-lg transition-colors ${
      isActive
        ? "bg-dark-accent text-dark-primary font-bold"
        : "text-dark-text-secondary hover:bg-dark-secondary hover:text-dark-text"
    }`;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="md:w-64 flex-shrink-0">
          <div className="bg-dark-secondary p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2">
              Admin Panel
            </h2>
            <nav className="space-y-2">
              <NavLink to="/admin/dashboard" className={navLinkClass}>
                <LayoutDashboard size={20} className="mr-3" />
                <span>Dashboard</span>
              </NavLink>
              <NavLink to="/admin/users" className={navLinkClass}>
                <Users size={20} className="mr-3" />
                <span>Users</span>
              </NavLink>
              <NavLink to="/admin/products" className={navLinkClass}>
                <Package size={20} className="mr-3" />
                <span>Products</span>
              </NavLink>
              <NavLink to="/admin/orders" className={navLinkClass}>
                <ShoppingCart size={20} className="mr-3" />
                <span>Orders</span>
              </NavLink>
              <NavLink to="/admin/analytics" className={navLinkClass}>
                <BarChart2 size={20} className="mr-3" />
                <span>Analytics</span>
              </NavLink>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-grow">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
