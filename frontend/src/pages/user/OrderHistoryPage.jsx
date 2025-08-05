import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMyOrders } from "../../features/orders/orderSlice";
import Spinner from "../../components/common/Spinner";
import RatingModal from "../../components/user/RatingModal";
import { Star } from "lucide-react";

const OrderHistoryPage = () => {
  const dispatch = useDispatch();
  const { orders, status } = useSelector((state) => state.orders);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    dispatch(getMyOrders());
  }, [dispatch]);

  const openRatingModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  if (status === "loading") {
    return <Spinner />;
  }

  return (
    <div className="bg-dark-secondary p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-dark-text mb-6">My Orders</h1>
      {orders.length === 0 ? (
        <p className="text-dark-text-secondary">
          You haven't placed any orders yet.
        </p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="border border-gray-700 rounded-lg p-4"
            >
              <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-700">
                <div>
                  <p className="font-semibold">
                    Order ID:{" "}
                    <span className="font-mono text-sm text-dark-text-secondary">
                      {order._id}
                    </span>
                  </p>
                  <p className="text-sm text-dark-text-secondary">
                    Date: {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p
                    className={`font-bold text-lg ${
                      order.paymentDetails.paymentStatus === "Paid"
                        ? "text-green-400"
                        : "text-yellow-400"
                    }`}
                  >
                    ${order.totalAmount.toFixed(2)}
                  </p>
                  <p className="text-sm font-semibold">{order.status}</p>
                </div>
              </div>
              <div className="space-y-3">
                {order.items.map((item) => (
                  <div
                    key={item._id}
                    className="flex justify-between items-center"
                  >
                    <div>
                      <p className="font-semibold">
                        {item.name}{" "}
                        <span className="text-sm font-normal text-dark-text-secondary">
                          x {item.quantity}
                        </span>
                      </p>
                    </div>
                    {order.paymentDetails.paymentStatus === "Paid" && (
                      <button
                        onClick={() => openRatingModal(item.product)}
                        className="flex items-center text-sm text-dark-accent hover:underline"
                      >
                        <Star size={16} className="mr-1" /> Rate Product
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      {selectedProduct && (
        <RatingModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          productId={selectedProduct}
        />
      )}
    </div>
  );
};

export default OrderHistoryPage;
