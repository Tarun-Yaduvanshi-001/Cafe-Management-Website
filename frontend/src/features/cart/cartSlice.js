import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/apiSlice";
import toast from "react-hot-toast";

const initialState = {
  cart: null,
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

// Async thunk for fetching the user's cart
export const getCart = createAsyncThunk("cart/getCart", async (_, thunkAPI) => {
  try {
    const { data } = await api.get("/api/cart");
    return data;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

// Async thunk for adding an item to the cart
export const addItemToCart = createAsyncThunk(
  "cart/addItem",
  async (itemData, thunkAPI) => {
    try {
      const { data } = await api.post("/api/cart", itemData); // { productId, quantity }
      toast.success("Item added to cart!");
      return data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Async thunk for updating an item's quantity in the cart
export const updateCartItem = createAsyncThunk(
  "cart/updateItem",
  async (itemData, thunkAPI) => {
    try {
      const { itemId, quantity } = itemData;
      const { data } = await api.put(`/api/cart/${itemId}`, { quantity });
      return data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Async thunk for removing an item from the cart
export const removeItemFromCart = createAsyncThunk(
  "cart/removeItem",
  async (itemId, thunkAPI) => {
    try {
      const { data } = await api.delete(`/api/cart/${itemId}`);
      toast.success("Item removed from cart.");
      return data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    resetCart: (state) => {
      state.cart = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle all pending states
      .addMatcher(
        (action) =>
          action.type.startsWith("cart/") && action.type.endsWith("/pending"),
        (state) => {
          state.status = "loading";
        }
      )
      // Handle all fulfilled states
      .addMatcher(
        (action) =>
          action.type.startsWith("cart/") && action.type.endsWith("/fulfilled"),
        (state, action) => {
          state.status = "succeeded";
          state.cart = action.payload;
        }
      )
      // Handle all rejected states
      .addMatcher(
        (action) =>
          action.type.startsWith("cart/") && action.type.endsWith("/rejected"),
        (state, action) => {
          state.status = "failed";
          state.error = action.payload;
        }
      );
  },
});

export const { resetCart } = cartSlice.actions;
export default cartSlice.reducer;
