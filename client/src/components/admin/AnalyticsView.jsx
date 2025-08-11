import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, DollarSign, Coffee, Users, ShoppingCart } from "lucide-react";
import { useSelector } from "react-redux";
import Loader from "../Loader";

export function AnalyticsView() {
  // Fetch live analytics data from the Redux store
  const { analytics, status } = useSelector(state => state.admin);

  const formatCurrency = (amount) => `$${(amount || 0).toFixed(2)}`;

  // This check is now more robust. It shows the loader if status is loading OR if the data is not yet present.
  if (status === 'loading' || !analytics) {
    return <Loader />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white">Analytics Dashboard</h2>
        <div className="text-gray-400 text-sm">
          Live Performance Metrics
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {/* FIX: Use optional chaining (?.) and a fallback value (?? 0) */}
              {formatCurrency(analytics?.dailyRevenue ?? 0)}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{analytics?.dailyOrders ?? 0}</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{analytics?.totalCustomers ?? 0}</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Avg Order Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {formatCurrency(analytics?.averageOrderValue ?? 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-orange-500" />
            Top Selling Items
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* FIX: Check if topItems is an array before mapping */}
            {(analytics?.topItems || []).map((item, index) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-white font-medium">{item.name}</p>
                    <p className="text-gray-400 text-sm">{item.orders} orders</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-orange-500 font-semibold">
                    {formatCurrency(item.revenue)}
                  </p>
                  <p className="text-gray-400 text-sm">revenue</p>
                </div>
              </div>
            ))}
            {/* Add a message for when there are no top items */}
            {(analytics?.topItems || []).length === 0 && (
                <p className="text-gray-400 text-center">No sales data available yet.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}