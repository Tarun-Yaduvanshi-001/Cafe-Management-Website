import { configureStore } from "@reduxjs/toolkit";


import AuthReducer from './features/AuthSlice' ;
import CartReducer from './features/CartSlice'

const store = configureStore({
    reducer : {
        auth : AuthReducer ,
        cart : CartReducer
    } 
})

export default store