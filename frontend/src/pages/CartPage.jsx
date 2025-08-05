import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getCart,
  updateCartItem,
  removeItemFromCart,
} from "../features/cart/cartSlice";
import Spinner from "../components/common/Spinner";
import { Trash2, Plus, Minus } from "lucide-react";

const CartPage = () => {
  const dispatch = useDispatch();
  const { cart, status } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      dispatch(getCart());
    }
  }, [dispatch, user]);

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity > 0) {
      dispatch(updateCartItem({ itemId, quantity: newQuantity }));
    }
  };

  const handleRemoveItem = (itemId) => {
    dispatch(removeItemFromCart(itemId));
  };

  if (!user) {
    return (
      <div className="container mx-auto text-center py-20">
        <h2 className="text-2xl font-semibold mb-4">Your Cart is Empty</h2>
        <p className="text-dark-text-secondary mb-6">
          Please{" "}
          <Link to="/login" className="text-dark-accent underline">
            log in
          </Link>{" "}
          to view your cart.
        </p>
      </div>
    );
  }

  if (status === "loading" && !cart) return <Spinner />;

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto text-center py-20">
        <h2 className="text-2xl font-semibold mb-4">Your Cart is Empty</h2>
        <p className="text-dark-text-secondary mb-6">
          Looks like you haven't added anything to your cart yet.
        </p>
        <Link
          to="/order"
          className="bg-dark-accent text-dark-primary font-bold py-3 px-8 rounded-full text-lg hover:opacity-90 transition-all"
        >
          Start Ordering
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-dark-text mb-8">
        Your Shopping Cart
      </h1>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="flex-grow">
          <div className="space-y-4">
            {cart.items.map((item) => (
              <div
                key={item._id}
                className="flex items-center bg-dark-secondary p-4 rounded-lg shadow"
              >
                <img
                  src={
                    item.product.imageUrl ||
                    "https://placehold.co/100x100/2c2c2c/e5e7eb?text=Item"
                  }
                  alt={item.product.name}
                  className="w-20 h-20 rounded-md object-cover mr-4"
                />
                <div className="flex-grow">
                  <h3 className="font-semibold text-lg">{item.product.name}</h3>
                  <p className="text-dark-text-secondary text-sm">
                    ${item.price.toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-gray-600 rounded-md">
                    <button
                      onClick={() =>
                        handleQuantityChange(item._id, item.quantity - 1)
                      }
                      className="p-2 hover:bg-gray-700 rounded-l-md disabled:opacity-50"
                      disabled={item.quantity <= 1}
                    >
                      <Minus size={16} />
                    </button>
                    <span className="px-4 font-semibold">{item.quantity}</span>
                    <button
                      onClick={() =>
                        handleQuantityChange(item._id, item.quantity + 1)
                      }
                      className="p-2 hover:bg-gray-700 rounded-r-md"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <p className="font-bold w-20 text-right">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                  <button
                    onClick={() => handleRemoveItem(item._id)}
                    className="text-red-500 hover:text-red-400"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:w-1/3">
          <div className="bg-dark-secondary p-6 rounded-lg shadow sticky top-24">
            <h2 className="text-2xl font-bold border-b border-gray-700 pb-4 mb-4">
              Order Summary
            </h2>
            <div className="flex justify-between mb-2">
              <span className="text-dark-text-secondary">Subtotal</span>
              <span className="font-semibold">
                ${cart.totalPrice.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-dark-text-secondary">Taxes & Fees</span>
              <span className="font-semibold">Calculated at checkout</span>
            </div>
            <div className="border-t border-gray-700 my-4"></div>
            <div className="flex justify-between font-bold text-xl mb-6">
              <span>Total</span>
              <span>${cart.totalPrice.toFixed(2)}</span>
            </div>
            <Link
              to="/checkout"
              className="w-full bg-dark-accent text-dark-primary font-bold py-3 px-8 rounded-lg text-lg hover:opacity-90 transition-all text-center block"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
