import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout, reset } from "../../features/auth/authSlice";
import { Coffee, ShoppingCart, User, LogOut, ShieldCheck } from "lucide-react";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate("/");
  };

  return (
    <header className="bg-dark-secondary shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link
              to="/"
              className="flex items-center space-x-2 text-dark-accent hover:opacity-80 transition-opacity"
            >
              <Coffee size={28} />
              <span className="text-2xl font-bold">CafeQueue</span>
            </Link>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/order"
              className="text-dark-text hover:text-dark-accent transition-colors font-medium"
            >
              Order
            </Link>
            {/* Add other links here */}
          </nav>
          <div className="flex items-center space-x-4">
            <Link
              to="/cart"
              className="relative text-dark-text hover:text-dark-accent transition-colors"
            >
              <ShoppingCart size={24} />
              {/* Add cart count here later */}
            </Link>
            {user ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 text-dark-text hover:text-dark-accent">
                  <User size={24} />
                  <span className="hidden lg:inline">
                    {user.name.split(" ")[0]}
                  </span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-dark-secondary rounded-md shadow-lg py-1 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  {user.role === "admin" && (
                    <Link
                      to="/admin"
                      className="flex items-center px-4 py-2 text-sm text-dark-text hover:bg-gray-700"
                    >
                      <ShieldCheck size={16} className="mr-2" /> Admin
                    </Link>
                  )}
                  <Link
                    to="/dashboard"
                    className="flex items-center px-4 py-2 text-sm text-dark-text hover:bg-gray-700"
                  >
                    <User size={16} className="mr-2" /> Dashboard
                  </Link>
                  <button
                    onClick={onLogout}
                    className="w-full text-left flex items-center px-4 py-2 text-sm text-dark-text hover:bg-gray-700"
                  >
                    <LogOut size={16} className="mr-2" /> Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-dark-text bg-gray-700 rounded-md hover:bg-gray-600 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 text-sm font-medium text-dark-primary bg-dark-accent rounded-md hover:opacity-90 transition-opacity"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
