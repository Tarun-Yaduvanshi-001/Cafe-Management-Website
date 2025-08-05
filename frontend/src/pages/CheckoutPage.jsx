import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createOrder, resetOrders } from "../features/orders/orderSlice";
import { resetCart } from "../features/cart/cartSlice";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "../components/checkout/CheckoutForm";
import Spinner from "../components/common/Spinner";

// Load Stripe outside of a component’s render to avoid recreating the Stripe object on every render.
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart } = useSelector((state) => state.cart);
  const { currentOrder, status: orderStatus } = useSelector(
    (state) => state.orders
  );

  useEffect(() => {
    // If there's no cart or cart is empty, redirect to order page
    if (!cart || cart.items.length === 0) {
      navigate("/order");
    } else if (!currentOrder) {
      // Create an order in 'Pending' state when the page loads
      dispatch(createOrder());
    }

    // Cleanup on unmount
    return () => {
      dispatch(resetOrders());
    };
  }, [cart, currentOrder, dispatch, navigate]);

  // When a new order is successfully created, we clear the cart state
  useEffect(() => {
    if (currentOrder) {
      dispatch(resetCart());
    }
  }, [currentOrder, dispatch]);

  if (orderStatus === "loading" || !currentOrder) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise}>
      <div className="container mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-center text-dark-text mb-8">
          Checkout
        </h1>
        <div className="bg-dark-secondary p-8 rounded-lg shadow-lg">
          <div className="border-b border-gray-700 pb-4 mb-6">
            <h2 className="text-2xl font-bold">Order Summary</h2>
            {currentOrder.items.map((item) => (
              <div
                key={item._id}
                className="flex justify-between items-center mt-4"
              >
                <span className="text-dark-text">
                  {item.name} x {item.quantity}
                </span>
                <span className="font-semibold">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
            <div className="flex justify-between font-bold text-xl mt-4 pt-4 border-t border-gray-600">
              <span>Total</span>
              <span>${currentOrder.totalAmount.toFixed(2)}</span>
            </div>
          </div>
          <CheckoutForm orderId={currentOrder._id} />
        </div>
      </div>
    </Elements>
  );
};

export default CheckoutPage;
