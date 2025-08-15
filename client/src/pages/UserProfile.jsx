import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserOrders } from '../redux/features/userSlice';
import Loader from '../components/Loader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Phone, ShoppingCart, Coffee } from 'lucide-react';

const statusColors = {
  Pending: "bg-yellow-500",
  Preparing: "bg-blue-500",
  Ready: "bg-green-500",
  Completed: "bg-gray-500",
};

const UserProfile = () => {
  const dispatch = useDispatch();
  const { name, email } = useSelector((state) => state.auth);
  const { orders, status, error } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  if (status === 'loading') {
    return <Loader />;
  }

  if (status === 'failed') {
    return <div className="text-center text-red-500 mt-10">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6 md:p-8">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-orange-400">My Profile</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Details Card */}
          <div className="lg:col-span-1">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <User className="text-orange-500" />
                  <span>Your Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400">Full Name</p>
                  <p className="font-medium">{name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Email Address</p>
                  <p className="font-medium">{email}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order History */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <ShoppingCart className="text-orange-400" />
              <span>Order History</span>
            </h2>
            <div className="space-y-4">
              {orders.length > 0 ? (
                orders.map((order) => (
                  <Card key={order._id} className="bg-gray-800/50 border-gray-700">
                    <CardHeader className="flex flex-row justify-between items-start">
                      <div>
                        <CardTitle className="text-sm font-mono text-gray-400">ORDER #{order._id}</CardTitle>
                        <p className="text-sm text-gray-500">{new Date(order.orderTime).toLocaleDateString()}</p>
                      </div>
                      <Badge className={`${statusColors[order.status]} text-white`}>{order.status}</Badge>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 mb-4">
                        {order.items.map(item => (
                          <div key={item._id} className="flex justify-between items-center text-sm">
                            <div className="flex items-center gap-2">
                                <Coffee className="w-4 h-4 text-orange-400" />
                                <span>{item.quantity} x {item.productId?.name || 'Unknown Item'}</span>
                            </div>
                            <span>₹{(item.productId?.price * item.quantity || 0).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                      <div className="border-t border-gray-700 pt-2 flex justify-between font-bold">
                        <span>Total</span>
                        <span>₹{order.totalAmount.toFixed(2)}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p className="text-gray-400">You haven't placed any orders yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;