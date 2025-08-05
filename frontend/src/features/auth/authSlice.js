import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/apiSlice";
import { auth as firebaseAuth, googleProvider } from "../../config/firebase";
import { signInWithPopup } from "firebase/auth";
import toast from "react-hot-toast";

// Helper to get user from localStorage
const user = JSON.parse(localStorage.getItem("user"));

const initialState = {
  user: user ? user : null,
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

// Async thunk for user registration
export const register = createAsyncThunk(
  "auth/register",
  async (userData, thunkAPI) => {
    try {
      const response = await api.post("/api/auth/register", userData);
      localStorage.setItem("user", JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Async thunk for user login
export const login = createAsyncThunk(
  "auth/login",
  async (userData, thunkAPI) => {
    try {
      const response = await api.post("/api/auth/login", userData);
      localStorage.setItem("user", JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Async thunk for Google Sign-In
export const googleSignIn = createAsyncThunk(
  "auth/googleSignIn",
  async (_, thunkAPI) => {
    try {
      const result = await signInWithPopup(firebaseAuth, googleProvider);
      const idToken = await result.user.getIdToken();
      const response = await api.post("/api/auth/google-signin", { idToken });
      localStorage.setItem("user", JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Logout action
export const logout = createAsyncThunk("auth/logout", async () => {
  localStorage.removeItem("user");
});

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: (state) => {
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.status = "loading";
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
        toast.success("Registration successful!");
      })
      .addCase(register.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        state.user = null;
        toast.error(action.payload);
      })
      .addCase(login.pending, (state) => {
        state.status = "loading";
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
        toast.success(`Welcome back, ${action.payload.name}!`);
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        state.user = null;
        toast.error(action.payload);
      })
      .addCase(googleSignIn.pending, (state) => {
        state.status = "loading";
      })
      .addCase(googleSignIn.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
        toast.success(`Welcome, ${action.payload.name}!`);
      })
      .addCase(googleSignIn.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        state.user = null;
        toast.error(action.payload);
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        toast.success("Logged out successfully.");
      });
  },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;
