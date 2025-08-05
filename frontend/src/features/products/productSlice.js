import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/apiSlice";
import toast from "react-hot-toast";

const initialState = {
  products: [],
  product: null, // For product details page
  page: 1,
  pages: 1,
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

// Async thunk for fetching products with filters, sorting, and pagination
export const getProducts = createAsyncThunk(
  "products/getProducts",
  async (params, thunkAPI) => {
    try {
      const { data } = await api.get("/api/products", { params });
      return data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    reset: (state) => {
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.products = action.payload.products;
        state.page = action.payload.page;
        state.pages = action.payload.pages;
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { reset } = productSlice.actions;
export default productSlice.reducer;
