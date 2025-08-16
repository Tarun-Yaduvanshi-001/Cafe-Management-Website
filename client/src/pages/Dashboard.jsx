import { useState, useEffect } from "react";
import { AppSidebar } from "../components/admin/AppSidebar";
import { OrdersView } from "../components/admin/OrdersView";
import { MenuView } from "../components/admin/MenuView";
import { CustomersView } from "../components/admin/CustomersView";
import { AnalyticsView } from "../components/admin/AnalyticsView";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminData } from "../redux/features/adminSlice";
import Loader from "../components/Loader";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

const Dashboard = () => {
  const [activeView, setActiveView] = useState("orders");
  const dispatch = useDispatch();
  const adminState = useSelector(state => state.admin);

  useEffect(() => {
    // When the component first loads, fetch data for the initial view
    // This check prevents re-fetching if data is already present
    if (!adminState[activeView] || adminState[activeView].length === 0) {
      dispatch(fetchAdminData(activeView));
    }
  }, [dispatch, activeView, adminState]);

  // FIX: This function now re-fetches data every time you switch views
  // This ensures the loyalty points are always up-to-date.
  const handleSetView = (view) => {
    setActiveView(view);
    dispatch(fetchAdminData(view));
  };

  const renderView = () => {
    const viewData = adminState[activeView];
    // Show a loader if the data for the specific active view is still loading
    if (adminState.status === 'loading' && (!viewData || (Array.isArray(viewData) && viewData.length === 0))) {
      return <Loader />;
    }
    
    if (adminState.status === 'failed') {
      return <div className="text-red-500 text-center">Error: {adminState.error}</div>;
    }

    switch (activeView) {
      case "orders": return <OrdersView />;
      case "menu": return <MenuView />;
      case "customers": return <CustomersView />;
      case "analytics": return <AnalyticsView />;
      default: return <OrdersView />;
    }
  };

  const getViewTitle = () => {
    switch (activeView) {
      case "orders": return "Order Management";
      case "menu": return "Menu Management";
      case "customers": return "Customer Management";
      case "analytics": return "Analytics Dashboard";
      default: return "Dashboard";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar activeView={activeView} setActiveView={handleSetView} />
          <main className="flex-1 p-6 overflow-auto">
            <div className="flex items-center gap-4 mb-8">
              <SidebarTrigger className="text-white hover:bg-gray-800/50 rounded-lg p-2 transition-colors" />
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                  CafeHub
                </h1>
                <p className="text-gray-400 text-sm">{getViewTitle()}</p>
              </div>
            </div>
            <div className="animate-fade-in">
              {renderView()}
            </div>
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default Dashboard;