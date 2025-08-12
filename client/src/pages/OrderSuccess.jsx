import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { getCart } from '../redux/features/CartSlice';

const OrderSuccess = () => {
    const [searchParams] = useSearchParams();
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();

    useEffect(() => {
        const sessionId = searchParams.get('session_id');
        if (sessionId) {
            axios.post('http://localhost:3000/api/payment/fulfill-order', { session_id: sessionId }, { withCredentials: true })
                .then(() => {
                    // Refresh the cart (which should now be empty)
                    dispatch(getCart());
                })
                .catch(err => console.error("Error fulfilling order:", err))
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [searchParams, dispatch]);

    if (loading) {
        return <div className="text-center text-white mt-20">Finalizing your order...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center text-center p-4">
            <CheckCircle className="w-24 h-24 text-green-400 mb-6" />
            <h1 className="text-4xl font-bold mb-2">Thank You!</h1>
            <p className="text-lg text-gray-300 mb-8">Your order has been placed successfully.</p>
            <Link to="/menu" className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded">
                Continue Shopping
            </Link>
        </div>
    );
};

export default OrderSuccess;