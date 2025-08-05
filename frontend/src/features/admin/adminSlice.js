import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/apiSlice";
import toast from "react-hot-toast";

const initialState = {
  users: [],
  orders: [],
  products: [], // For the product management list
  analytics: null,
  status: "idle",
  error: null,
};

// --- User Management Thunks ---
export const getUsers = createAsyncThunk(
  "admin/getUsers",
  async (_, thunkAPI) => {
    try {
      const { data } = await api.get("/api/admin/users");
      return data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const deleteUser = createAsyncThunk(
  "admin/deleteUser",
  async (userId, thunkAPI) => {
    try {
      await api.delete(`/api/admin/users/${userId}`);
      toast.success("User removed successfully.");
      return userId;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// --- Product Management Thunks ---
export const getAdminProducts = createAsyncThunk(
  "admin/getProducts",
  async (_, thunkAPI) => {
    try {
      // Fetch all products without pagination for the admin list
      const { data } = await api.get("/api/products?pageSize=100"); // Or adjust as needed
      return data.products;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const createProduct = createAsyncThunk(
  "admin/createProduct",
  async (productData, thunkAPI) => {
    try {
      const { data } = await api.post("/api/admin/products", productData);
      toast.success("Product created successfully!");
      return data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const updateProduct = createAsyncThunk(
  "admin/updateProduct",
  async (productData, thunkAPI) => {
    try {
      const { data } = await api.put(
        `/api/admin/products/${productData._id}`,
        productData
      );
      toast.success("Product updated successfully!");
      return data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "admin/deleteProduct",
  async (productId, thunkAPI) => {
    try {
      await api.delete(`/api/admin/products/${productId}`);
      toast.success("Product deleted successfully.");
      return productId;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// --- Order Management Thunks ---
export const getAllOrders = createAsyncThunk(
  "admin/getAllOrders",
  async (_, thunkAPI) => {
    try {
      const { data } = await api.get("/api/admin/orders");
      return data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  "admin/updateOrderStatus",
  async ({ orderId, status }, thunkAPI) => {
    try {
      const { data } = await api.put(`/api/admin/orders/${orderId}/status`, {
        status,
      });
      toast.success("Order status updated.");
      return data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// --- Analytics Thunk ---
export const getRevenueAnalytics = createAsyncThunk(
  "admin/getAnalytics",
  async (timeFrame, thunkAPI) => {
    try {
      const { data } = await api.get(
        `/api/admin/analytics/revenue?timeFrame=${timeFrame}`
      );
      return data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    resetAdmin: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Generic pending
      .addMatcher(
        (action) =>
          action.type.startsWith("admin/") && action.type.endsWith("/pending"),
        (state) => {
          state.status = "loading";
        }
      )
      // Generic rejected
      .addMatcher(
        (action) =>
          action.type.startsWith("admin/") && action.type.endsWith("/rejected"),
        (state, action) => {
          state.status = "failed";
          state.error = action.payload;
        }
      )
      // Get Users
      .addCase(getUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.users = action.payload;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.users = state.users.filter((user) => user._id !== action.payload);
      })
      // Get Products (for admin)
      .addCase(getAdminProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.products = action.payload;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.products.push(action.payload);
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.products.findIndex(
          (p) => p._id === action.payload._id
        );
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.products = state.products.filter((p) => p._id !== action.payload);
      })
      // Get All Orders
      .addCase(getAllOrders.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.orders = action.payload;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.orders.findIndex(
          (o) => o._id === action.payload._id
        );
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
      })
      // Analytics
      .addCase(getRevenueAnalytics.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.analytics = action.payload;
      });
  },
});

export const { resetAdmin } = adminSlice.actions;
export default adminSlice.reducer;
