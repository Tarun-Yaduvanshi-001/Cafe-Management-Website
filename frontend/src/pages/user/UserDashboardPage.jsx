import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { ShoppingBag, Star, User } from "lucide-react";

const UserDashboardPage = () => {
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
              My Account
            </h2>
            <nav className="space-y-2">
              <NavLink to="/dashboard/profile" className={navLinkClass}>
                <User size={20} className="mr-3" />
                <span>Profile</span>
              </NavLink>
              <NavLink to="/dashboard/orders" className={navLinkClass}>
                <ShoppingBag size={20} className="mr-3" />
                <span>My Orders</span>
              </NavLink>
              <NavLink to="/dashboard/reviews" className={navLinkClass}>
                <Star size={20} className="mr-3" />
                <span>My Reviews</span>
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

export default UserDashboardPage;
