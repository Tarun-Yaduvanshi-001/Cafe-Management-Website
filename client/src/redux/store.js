import { configureStore } from "@reduxjs/toolkit";
import AuthReducer from './features/AuthSlice';
import CartReducer from './features/CartSlice';
import ProductReducer from './features/productSlice';
import AdminReducer from './features/adminSlice';
import UserReducer from './features/userSlice'; // Import the user slice

const store = configureStore({
    reducer: {
        auth: AuthReducer,
        cart: CartReducer,
        products: ProductReducer,
        admin: AdminReducer,
        user: UserReducer, // Add the user slice to the store
    }
});

export default store;