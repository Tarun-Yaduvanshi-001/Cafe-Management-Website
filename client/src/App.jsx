import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { verifyAppSession } from './redux/features/AuthSlice';
import Toaster from './components/Toaster';
import Loader from './components/Loader';

import Hompage from './pages/Hompage.jsx';
import Dashboard from './pages/Dashboard.jsx';
import ProtectRoutes from './components/ProtectRoutes.jsx';
import Login from './pages/Login.jsx';
import OpenRoutes from './components/OpenRoutes.jsx';
import Menu from './pages/Menu.jsx';
import OrderSuccess from './pages/OrderSuccess.jsx'; // 1. Import the new page

function App() {
  const dispatch = useDispatch();
  const { isInitializing } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(verifyAppSession());
  }, [dispatch]);

  if (isInitializing) {
    return <Loader />;
  }

  return (
    <div>
      <Toaster />
      <Routes>
        <Route element={<OpenRoutes />}>
          <Route path="/" element={<Hompage />} />
          <Route path="/login" element={<Login />} />
        </Route>
        <Route element={<ProtectRoutes roles={['admin', 'customer']} />}>
          <Route path="/menu" element={<Menu />} />
          {/* 2. Add the new route */}
          <Route path="/order-success" element={<OrderSuccess />} />
        </Route>
        <Route element={<ProtectRoutes roles={['admin']} />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;