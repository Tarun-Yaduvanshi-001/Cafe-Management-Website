import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Coffee, Plus, Minus, ShoppingCart, Star } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { addToCart, getCart, removeItemFromCart, updateCartQuantity } from '../redux/features/CartSlice';
import { fetchProducts } from '../redux/features/productSlice';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/Loader';
import { loadStripe } from '@stripe/stripe-js'; // Import loadStripe
import axios from 'axios';
import { toast } from 'sonner';

// Initialize Stripe outside the component
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const categories = ['All', 'Coffee', 'Pastry', 'Food', 'Tea', 'Dessert'];

const Menu = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const dispatch = useDispatch();

  const { cart, totalCartItems } = useSelector((state) => state.cart);
  const { items: menuItems, status: productStatus, error: productError } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(getCart());
  }, [dispatch]);

  const handleAddToCart = (item) => {
    const payload = {
      productId: item._id,
      quantity: 1,
    };
    dispatch(addToCart(payload));
  };

  const handleRemoveFromCart = (productId) => {
    const payload = { productId };
    dispatch(removeItemFromCart(payload));
  };

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) {
      handleRemoveFromCart(productId);
    } else {
      dispatch(updateCartQuantity({ productId, quantity: newQuantity }));
    }
  };

  // The checkout handler for the "Place Order" button
  const handleCheckout = async () => {
    toast.info("Redirecting to payment...");
    try {
        const stripe = await stripePromise;
        const response = await axios.post('http://localhost:3000/api/payment/create-checkout-session', {}, { withCredentials: true });
        const session = response.data;
        
        const result = await stripe.redirectToCheckout({
            sessionId: session.id,
        });

        if (result.error) {
            toast.error(result.error.message);
        }
    } catch (error) {
        toast.error("Checkout failed. Please try again.");
        console.error("Checkout error:", error);
    }
  };

  const filteredMenuItems =
    (menuItems || []).filter(item => 
      selectedCategory === 'All' || item.category === selectedCategory.toLowerCase()
    );

  if (productStatus === 'loading') {
    return <Loader />;
  }
  if (productStatus === 'failed') {
    return <div className="text-center text-red-500 mt-10">Error: {productError?.message || 'Failed to load products.'}</div>;
  }

  return (
    <div className="min-h-screen text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
                <Coffee className="w-12 h-12 text-orange-500" />
                <h1 className="text-5xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                MIDNIGHT CAFE BLOOM
                </h1>
            </div>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Welcome to our coffee paradise. Discover handcrafted beverages and freshly baked treats.
            </p>
        </div>
        <div className="flex justify-center mb-8">
          <div className="flex gap-2 p-1 bg-gray-900/50 rounded-xl backdrop-blur-sm">
            {categories.map((category) => (
              <Button
                key={category}
                onClick={() => setSelectedCategory(category)}
                variant={selectedCategory === category ? 'default' : 'ghost'}
                className={`transition-all duration-200 ${
                  selectedCategory === category
                    ? 'bg-orange-500 hover:bg-orange-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-8">
          {filteredMenuItems.map((item) => (
            <Card
              key={item._id}
              className={`bg-gray-900/50 border-gray-800 backdrop-blur-sm transition-all duration-300 group ${
                item.isAvailable 
                  ? 'hover:bg-gray-800/50 hover:scale-105 hover:shadow-xl' 
                  : 'opacity-50 cursor-not-allowed'
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-white text-lg font-semibold">{item.name}</CardTitle>
                      {item.popular && ( <Badge className="bg-orange-500/20 text-orange-400 text-xs border-orange-500/30">Popular</Badge> )}
                    </div>
                    <div className="flex items-center gap-1 mb-2">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-yellow-400 text-sm font-medium">{item.rating || 'N/A'}</span>
                    </div>
                  </div>
                  <Coffee className="w-8 h-8 text-orange-400/50 group-hover:text-orange-400 transition-colors" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-300 text-sm leading-relaxed">{item.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-orange-400 font-bold text-xl">₹ {(item.price || 0).toFixed(2)}</span>
                  {item.isAvailable ? (
                    <Button 
                      onClick={() => handleAddToCart(item)} 
                      className="bg-orange-500 hover:bg-orange-600 text-white transition-all duration-200 hover:scale-105" 
                      size="sm"
                    >
                      <Plus className="w-4 h-4" /> Add
                    </Button>
                  ) : (
                    <Button 
                      disabled 
                      className="bg-gray-700 text-gray-400 cursor-not-allowed" 
                      size="sm"
                    >
                      Unavailable
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {cart?.items?.length > 0 && (
          <Sheet>
            <SheetTrigger asChild>
              <Button className="fixed bottom-6 right-6 bg-orange-500 hover:bg-orange-600 text-white rounded-full p-4 shadow-2xl hover:scale-110 transition-all duration-200 z-50">
                <ShoppingCart className="w-6 h-6" />
                <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs min-w-[1.5rem] h-6 rounded-full flex items-center justify-center">{totalCartItems}</Badge>
              </Button>
            </SheetTrigger>
            <SheetContent className="bg-gray-900 border-gray-800 text-white flex flex-col">
              <SheetHeader>
                <SheetTitle className="text-white text-xl">Your Order</SheetTitle>
              </SheetHeader>
              <div className="flex-1 overflow-y-auto pr-4 -mr-4 space-y-4">
                {cart?.items?.map((item) => (
                  <div key={item.productId._id} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium text-white">{item.productId.name}</h3>
                      <p className="text-orange-400 font-semibold">₹ {item.productId.price.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Trash2 onClick={() => handleRemoveFromCart(item.productId._id)} className="text-red-500 hover:scale-110 transition-all duration-150 ease-in-out cursor-pointer" />
                      <Button size="sm" variant="outline" className="w-8 h-8 p-0 border-gray-600 text-gray-300 hover:bg-gray-700" onClick={() => handleQuantityChange(item.productId._id, item.quantity - 1)}><Minus className="w-3 h-3" /></Button>
                      <span className="w-8 text-center text-white font-medium">{item.quantity}</span>
                      <Button size="sm" variant="outline" className="w-8 h-8 p-0 border-gray-600 text-gray-300 hover:bg-gray-700" onClick={() => handleQuantityChange(item.productId._id, item.quantity + 1)}><Plus className="w-3 h-3" /></Button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-700 pt-4">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span className="text-white">Total:</span>
                  <span className="text-orange-400">₹ {cart.totalPrice.toFixed(2)}</span>
                </div>
                {/* FIX: Reconnected the handleCheckout function to the onClick event */}
                <Button onClick={handleCheckout} className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white">Place Order</Button>
              </div>
            </SheetContent>
          </Sheet>
        )}
      </div>
    </div>
  );
};

export default Menu;