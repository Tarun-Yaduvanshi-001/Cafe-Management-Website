import { configureStore } from "@reduxjs/toolkit";
import AuthReducer from './features/AuthSlice';
import CartReducer from './features/CartSlice';
import ProductReducer from './features/productSlice';
import AdminReducer from './features/adminSlice';

const store = configureStore({
    reducer: {
        auth: AuthReducer,
        cart: CartReducer,
        products: ProductReducer,
        admin: AdminReducer,
    }
});

export default store;