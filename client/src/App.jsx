import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { verifyAppSession } from './redux/features/AuthSlice';

import Hompage from './pages/Hompage.jsx';
import Dashboard from './pages/Dashboard.jsx';
import ProtectRoutes from './components/ProtectRoutes.jsx';
import Login from './pages/Login.jsx';
import OpenRoutes from './components/OpenRoutes.jsx';
import Menu from './pages/Menu.jsx';
import Loader from './components/Loader.jsx';
import Toaster from './components/Toaster.jsx';

function App() {
  const dispatch = useDispatch();
  const { isInitializing } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(verifyAppSession());
  }, [dispatch]);

  // Use your existing Loader component
  if (isInitializing) {
    return <Loader />;
  }

  return (
    <div>
      {/* 3. Add your new ThemedToaster component here */}
      <Toaster />
      <Routes>
        <Route element={<OpenRoutes />}>
          <Route path="/" element={<Hompage />} />
          <Route path="/login" element={<Login />} />
        </Route>
        <Route element={<ProtectRoutes roles={['admin', 'customer']} />}>
          <Route path="/menu" element={<Menu />} />
        </Route>
        <Route element={<ProtectRoutes roles={['admin']} />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;