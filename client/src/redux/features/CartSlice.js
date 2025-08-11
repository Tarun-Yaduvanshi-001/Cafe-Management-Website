import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

// ADD THIS NEW THUNK
export const updateCartQuantity = createAsyncThunk(
  'cart/updateQuantity',
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(`${API_BASE_URL}/updateQuantity`, { productId, quantity }, { withCredentials: true });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


// --- (addToCart, getCart, and removeItemFromCart thunks are unchanged) ---
export const addToCart = createAsyncThunk('cart/addToCart', async ({ productId, quantity }, { rejectWithValue }) => {
  try {
    const { data } = await axios.post(`${API_BASE_URL}/addToCart`, { productId, quantity }, { withCredentials: true });
    return data;
  } catch (error) { return rejectWithValue(error.response?.data || error.message); }
});
export const getCart = createAsyncThunk('cart/getCart', async (_, { rejectWithValue }) => {
  try {
    const { data } = await axios.get(`${API_BASE_URL}/getCart`, { withCredentials: true });
    return data;
  } catch (error) { return rejectWithValue(error.response?.data || error.message); }
});
export const removeItemFromCart = createAsyncThunk('cart/removeItemFromCart', async ({ productId }, { rejectWithValue }) => {
  try {
    const { data } = await axios.post(`${API_BASE_URL}/removeItem`, { productId }, { withCredentials: true });
    return data;
  } catch (error) { return rejectWithValue(error.response?.data || error.message); }
});


const initialState = {
  cart: null,
  totalCartItems: 0,
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Helper function to update state, preventing code duplication
    const updateCartState = (state, action) => {
        state.loading = false;
        state.cart = action.payload.cart;
        state.totalCartItems = action.payload.totalCartItems;
    };

    builder
      .addCase(addToCart.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(addToCart.fulfilled, updateCartState)
      .addCase(addToCart.rejected, (state, action) => { state.loading = false; state.error = action.payload; });

    builder
      .addCase(getCart.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(getCart.fulfilled, updateCartState)
      .addCase(getCart.rejected, (state, action) => { state.loading = false; state.error = action.payload; });

    builder
      .addCase(removeItemFromCart.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(removeItemFromCart.fulfilled, updateCartState)
      .addCase(removeItemFromCart.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
      
    builder
      .addCase(updateCartQuantity.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(updateCartQuantity.fulfilled, updateCartState)
      .addCase(updateCartQuantity.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export default cartSlice.reducer;