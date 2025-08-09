import { getCookie } from './../../utils/utils.js';
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

function OpenRoutes() {
  const isAuthenticated = getCookie('authenticated');

  if (isAuthenticated) {
    return <Navigate to="/menu" />;
  }

  return (
    <div>
      <Outlet />
    </div>
  );
}

export default OpenRoutes;