import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Coffee, Clock, User, DollarSign } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { updateOrderStatus, createOrder, fetchAdminData } from "../../redux/features/adminSlice";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Loader from "../Loader";
import { toast } from "sonner";

const statusColors = {
  Pending: "bg-yellow-500 hover:bg-yellow-600",
  Preparing: "bg-blue-500 hover:bg-blue-600",
  Ready: "bg-green-500 hover:bg-green-600",
  Completed: "bg-gray-500 hover:bg-gray-600",
};

const statusIcons = {
  Pending: Clock,
  Preparing: Coffee,
  Ready: Coffee,
  Completed: Coffee,
};

function NewOrderForm({ customers, menu, onSave }) {
    const [customerId, setCustomerId] = useState('');
    const [items, setItems] = useState([{ productId: '', quantity: 1 }]);
    const [total, setTotal] = useState(0);

    const handleItemChange = (index, field, value) => {
        const newItems = [...items];
        newItems[index][field] = value;
        setItems(newItems);
        calculateTotal(newItems);
    };

    const addItem = () => setItems([...items, { productId: '', quantity: 1 }]);

    const calculateTotal = (currentItems) => {
        const totalAmount = currentItems.reduce((sum, item) => {
            const product = menu.find(p => p._id === item.productId);
            return sum + (product ? product.price * parseInt(item.quantity) : 0);
        }, 0);
        setTotal(totalAmount);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // FIX: Add validation to prevent submitting an empty form
        if (!customerId || items.every(i => !i.productId)) {
            toast.error("Validation Error", { description: "Please select a customer and at least one item." });
            return;
        }
        onSave({
            userId: customerId,
            items: items.filter(i => i.productId && i.quantity > 0),
            totalAmount: total,
            status: 'Pending',
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Label>Customer</Label>
                <select onChange={(e) => setCustomerId(e.target.value)} className="w-full p-2 bg-gray-800 border-gray-700 rounded-md text-white">
                    <option value="">Select a customer</option>
                    {(customers || []).map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
            </div>
            <Label>Items</Label>
            {items.map((item, index) => (
                <div key={index} className="flex gap-2 items-center">
                    <select onChange={(e) => handleItemChange(index, 'productId', e.target.value)} className="w-full p-2 bg-gray-800 border-gray-700 rounded-md text-white">
                        <option value="">Select an item</option>
                        {(menu || []).map(m => <option key={m._id} value={m._id}>{m.name}</option>)}
                    </select>
                    <Input type="number" value={item.quantity} onChange={(e) => handleItemChange(index, 'quantity', e.target.value)} min="1" className="w-20 bg-gray-800 border-gray-700 text-white" />
                </div>
            ))}
            <Button type="button" variant="outline" onClick={addItem}>Add another item</Button>
            <div className="text-lg font-bold text-white">Total: ₹ {total.toFixed(2)}</div>
            <DialogFooter>
                <DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose>
                <Button type="submit" className="bg-orange-500 hover:bg-orange-600">Create Order</Button>
            </DialogFooter>
        </form>
    );
}

export function OrdersView() {
  const dispatch = useDispatch();
  const { orders, customers, menu, status } = useSelector(state => state.admin);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    // FIX: Ensure customers and menu data are fetched for the form
    if (customers.length === 0) dispatch(fetchAdminData('customers'));
    if (menu.length === 0) dispatch(fetchAdminData('menu'));
  }, [dispatch, customers.length, menu.length]);

  const handleUpdateStatus = (orderId, newStatus) => {
    dispatch(updateOrderStatus({ orderId, status: newStatus }));
  };
  
  const handleSaveOrder = (orderData) => {
      dispatch(createOrder(orderData));
      setIsFormOpen(false);
  };
  
  if (status === 'loading' && orders.length === 0) {
    return <Loader />;
  }

  return (
    <div className="space-y-8">
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-white">Orders Overview</h2>
                    <p className="text-gray-400">Manage and track all customer orders</p>
                </div>
                <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg hover:shadow-xl transition-all duration-200">
                        + New Order
                    </Button>
                </DialogTrigger>
            </div>
            <DialogContent className="bg-gray-900 border-gray-800 text-white">
                <DialogHeader>
                    <DialogTitle>Create New Order</DialogTitle>
                    <DialogDescription>
                        Select a customer and add items to create a new order.
                    </DialogDescription>
                </DialogHeader>
                <NewOrderForm customers={customers} menu={menu} onSave={handleSaveOrder} />
            </DialogContent>
        </Dialog>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {(orders || []).map((order) => {
          const StatusIcon = statusIcons[order.status] || Coffee;
          return (
            <Card key={order._id} className="bg-gray-900/50 border-gray-800">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-white text-xs font-mono">{order._id}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <p className="text-gray-400 text-sm">{new Date(order.orderTime).toLocaleTimeString()}</p>
                    </div>
                  </div>
                  <Badge className={`${statusColors[order.status]} text-white text-xs flex items-center gap-1`}>
                    <StatusIcon className="w-3 h-3" />
                    {order.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <p className="text-white font-medium">{order.userId?.name || "Guest"}</p>
                </div>
                <div className="space-y-1">
                  {(order.items || []).map((item) => (
                    <div key={item._id} className="flex items-center gap-2">
                      <Coffee className="w-3 h-3 text-orange-400" />
                      <p className="text-gray-300 text-sm">{item.quantity}x {item.productId?.name || "Item"}</p>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-gray-800">
                  <div className="flex items-center gap-2">
                    <span className="text-orange-400 font-bold text-lg">₹ {(order.totalAmount || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex gap-2">
                    {order.status === "Pending" && (
                      <Button size="sm" onClick={() => handleUpdateStatus(order._id, "Preparing")} className="bg-blue-500 hover:bg-blue-600 text-white text-xs">Start Prep</Button>
                    )}
                    {order.status === "Preparing" && (
                      <Button size="sm" onClick={() => handleUpdateStatus(order._id, "Ready")} className="bg-green-500 hover:bg-green-600 text-white text-xs">Mark Ready</Button>
                    )}
                    {order.status === "Ready" && (
                      <Button size="sm" onClick={() => handleUpdateStatus(order._id, "Completed")} className="bg-gray-500 hover:bg-gray-600 text-white text-xs">Complete</Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}