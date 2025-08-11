import { setCookie, removeCookie } from '../../../utils/utils';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { signOut } from 'firebase/auth';
import { auth } from './../../config/firebase';

const API_BASE_URL = 'http://localhost:3000/api';

const initialState = {
  isInitializing: true,
  isLoading: false,
  authenticated: false,
  name: null,
  id: null,
  role: null,
  email: null,
};

export const verifyAppSession = createAsyncThunk('auth/verifyAppSession', async (_, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/auth/verify`, null, { withCredentials: true });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data);
    }
});

export const login = createAsyncThunk('auth/login', async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, data, { withCredentials: true });
      return response.data;
    } catch (error) { return rejectWithValue(error.response?.data || 'Login failed'); }
});

export const signup = createAsyncThunk('auth/signup', async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/signup`, data);
      return response.data;
    } catch (error) { return rejectWithValue(error.response?.data || 'Signup failed'); }
});

export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
    try {
      await signOut(auth);
      await axios.post(`${API_BASE_URL}/auth/logout`, null, { withCredentials: true });
      return true;
    } catch (error) { return rejectWithValue(error.response?.data || 'Logout failed'); }
});

const AuthSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setInitializing: (state, action) => {
        state.isInitializing = action.payload;
    }
  },
  extraReducers: (builder) => {
    const handleAuthSuccess = (state, action) => {
      state.authenticated = action.payload.authenticated;
      state.name = action.payload.name;
      state.id = action.payload.id;
      state.role = action.payload.role;
      state.email = action.payload.email;
      setCookie('name', action.payload.name, { expires: 1 });
      setCookie('id', action.payload.id, { expires: 1 });
      setCookie('authenticated', action.payload.authenticated, { expires: 1 });
      setCookie('role', action.payload.role, { expires: 1 });
    };

    const handleLogout = (state) => {
      state.authenticated = false;
      state.name = null;
      state.id = null;
      state.role = null;
      state.email = null;
      removeCookie('name');
      removeCookie('id');
      removeCookie('authenticated');
      removeCookie('role');
    };

    builder
      .addCase(login.pending, (state) => { state.isLoading = true; })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        handleAuthSuccess(state, action);
      })
      .addCase(login.rejected, (state) => { state.isLoading = false; });

    builder
      .addCase(logout.fulfilled, (state) => { handleLogout(state); })
      .addCase(logout.rejected, (state) => { handleLogout(state); });

    builder
      .addCase(verifyAppSession.fulfilled, (state, action) => {
        if (action.payload) {
            handleAuthSuccess(state, action);
        }
        state.isInitializing = false;
      })
      .addCase(verifyAppSession.rejected, (state) => {
        state.isInitializing = false;
      });
  },
});

export const { setInitializing } = AuthSlice.actions;
export default AuthSlice.reducer;