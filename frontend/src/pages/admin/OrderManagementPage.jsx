import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrders,
  updateOrderStatus,
} from "../../features/admin/adminSlice";
import Spinner from "../../components/common/Spinner";

const statusOptions = [
  "Pending",
  "Preparing",
  "Ready",
  "Completed",
  "Cancelled",
];

const OrderManagementPage = () => {
  const dispatch = useDispatch();
  const { orders, status } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(getAllOrders());
  }, [dispatch]);

  const handleStatusChange = (orderId, newStatus) => {
    dispatch(updateOrderStatus({ orderId, status: newStatus }));
  };

  if (status === "loading") return <Spinner />;

  return (
    <div className="bg-dark-secondary p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-dark-text mb-6">
        Order Management
      </h1>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="p-4">Order ID</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Date</th>
              <th className="p-4">Total</th>
              <th className="p-4">Payment</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order._id}
                className="border-b border-gray-700 hover:bg-gray-800"
              >
                <td className="p-4 font-mono text-xs">{order._id}</td>
                <td className="p-4">{order.user?.name || "N/A"}</td>
                <td className="p-4">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="p-4 font-semibold">
                  ${order.totalAmount.toFixed(2)}
                </td>
                <td className="p-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      order.paymentDetails.paymentStatus === "Paid"
                        ? "bg-green-500 text-white"
                        : "bg-yellow-500 text-black"
                    }`}
                  >
                    {order.paymentDetails.paymentStatus}
                  </span>
                </td>
                <td className="p-4">
                  <select
                    value={order.status}
                    onChange={(e) =>
                      handleStatusChange(order._id, e.target.value)
                    }
                    className="bg-gray-700 text-dark-text rounded-md p-1 focus:outline-none focus:ring-1 focus:ring-dark-accent"
                  >
                    {statusOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderManagementPage;
