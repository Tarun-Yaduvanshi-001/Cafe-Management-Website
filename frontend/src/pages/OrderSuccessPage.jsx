import React, { useEffect } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getOrderById } from "../features/orders/orderSlice";
import Spinner from "../components/common/Spinner";
import { CheckCircle, AlertTriangle } from "lucide-react";

const OrderSuccessPage = () => {
  const { orderId } = useParams();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();

  const { currentOrder, status } = useSelector((state) => state.orders);
  const paymentSuccess = searchParams.get("success") === "true";
  const paymentCanceled = searchParams.get("canceled") === "true";

  useEffect(() => {
    if (orderId) {
      dispatch(getOrderById(orderId));
    }
  }, [orderId, dispatch]);

  if (status === "loading" || !currentOrder) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl text-center py-20 px-4">
      {paymentSuccess ? (
        <div className="bg-dark-secondary p-8 rounded-lg shadow-lg">
          <CheckCircle className="mx-auto text-green-400 w-16 h-16 mb-4" />
          <h1 className="text-3xl font-bold text-green-400">
            Payment Successful!
          </h1>
          <p className="text-dark-text-secondary mt-2 mb-6">
            Your order has been placed. Thank you for your purchase!
          </p>
          <p className="text-lg">
            Order ID:{" "}
            <span className="font-mono text-dark-accent">
              {currentOrder._id}
            </span>
          </p>
          <p className="mt-1">
            Status:{" "}
            <span className="font-semibold text-dark-accent">
              {currentOrder.status}
            </span>
          </p>
          <Link
            to="/dashboard/orders"
            className="mt-8 inline-block bg-dark-accent text-dark-primary font-bold py-3 px-8 rounded-lg text-lg hover:opacity-90 transition-all"
          >
            View My Orders
          </Link>
        </div>
      ) : paymentCanceled ? (
        <div className="bg-dark-secondary p-8 rounded-lg shadow-lg">
          <AlertTriangle className="mx-auto text-yellow-400 w-16 h-16 mb-4" />
          <h1 className="text-3xl font-bold text-yellow-400">
            Payment Canceled
          </h1>
          <p className="text-dark-text-secondary mt-2 mb-6">
            Your order was not processed. You can try checking out again from
            your cart.
          </p>
          <Link
            to="/cart"
            className="mt-8 inline-block bg-dark-accent text-dark-primary font-bold py-3 px-8 rounded-lg text-lg hover:opacity-90 transition-all"
          >
            Back to Cart
          </Link>
        </div>
      ) : (
        <div className="bg-dark-secondary p-8 rounded-lg shadow-lg">
          <AlertTriangle className="mx-auto text-red-500 w-16 h-16 mb-4" />
          <h1 className="text-3xl font-bold text-red-500">
            Something Went Wrong
          </h1>
          <p className="text-dark-text-secondary mt-2 mb-6">
            There was an issue with your order. Please contact support.
          </p>
        </div>
      )}
    </div>
  );
};

export default OrderSuccessPage;
