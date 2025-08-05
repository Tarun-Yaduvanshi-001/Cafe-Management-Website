import React, { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { useDispatch } from "react-redux";
import { createCheckoutSession } from "../../features/orders/orderSlice";
import Spinner from "../common/Spinner";

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#e5e7eb",
      fontFamily: "Inter, sans-serif",
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#9ca3af",
      },
    },
    invalid: {
      color: "#f87171",
      iconColor: "#f87171",
    },
  },
};

const CheckoutForm = ({ orderId }) => {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      setLoading(false);
      return;
    }

    const result = await dispatch(createCheckoutSession(orderId));

    if (result.payload) {
      const { id: sessionId } = result.payload;
      const { error } = await stripe.redirectToCheckout({ sessionId });
      if (error) {
        setError(error.message);
      }
    } else {
      setError("Could not create a checkout session.");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3 className="text-xl font-semibold mb-4">Payment Details</h3>
      <div className="p-4 border border-gray-600 rounded-lg bg-gray-700">
        <CardElement options={CARD_ELEMENT_OPTIONS} />
      </div>
      {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full mt-6 bg-dark-accent text-dark-primary font-bold py-3 px-8 rounded-lg text-lg hover:opacity-90 transition-all text-center block disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? <Spinner /> : "Pay Now"}
      </button>
    </form>
  );
};

export default CheckoutForm;
