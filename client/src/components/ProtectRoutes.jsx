import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import { getCookie } from './../../utils/utils.js';

function ProtectRoutes({ roles }) {
  const isAuthenticated = getCookie('authenticated');
  const role = getCookie('role');

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (roles && !roles.includes(role)) {
    return <Navigate to="/login" />;
  }

  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  );
}

export default ProtectRoutes;