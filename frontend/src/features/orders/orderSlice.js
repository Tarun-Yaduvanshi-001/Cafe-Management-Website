import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/apiSlice";
import toast from "react-hot-toast";

const initialState = {
  orders: [],
  currentOrder: null, // The order being processed or viewed
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

// Async thunk for creating a new order from the user's cart
export const createOrder = createAsyncThunk(
  "orders/createOrder",
  async (_, thunkAPI) => {
    try {
      const { data } = await api.post("/api/orders");
      return data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Async thunk for fetching a user's order history
export const getMyOrders = createAsyncThunk(
  "orders/getMyOrders",
  async (_, thunkAPI) => {
    try {
      const { data } = await api.get("/api/orders/myorders");
      return data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Async thunk for fetching a single order by ID
export const getOrderById = createAsyncThunk(
  "orders/getOrderById",
  async (orderId, thunkAPI) => {
    try {
      const { data } = await api.get(`/api/orders/${orderId}`);
      return data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Async thunk for creating a Stripe payment intent
export const createCheckoutSession = createAsyncThunk(
  "orders/createCheckoutSession",
  async (orderId, thunkAPI) => {
    try {
      const { data } = await api.post("/api/payment/create-checkout-session", {
        orderId,
      });
      return data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      toast.error("Could not initiate payment. Please try again.");
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    resetOrders: (state) => {
      state.orders = [];
      state.currentOrder = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.currentOrder = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(getMyOrders.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getMyOrders.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.orders = action.payload;
      })
      .addCase(getMyOrders.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(getOrderById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getOrderById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.currentOrder = action.payload;
      })
      .addCase(getOrderById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { resetOrders } = orderSlice.actions;
export default orderSlice.reducer;
