import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

export const fetchAdminData = createAsyncThunk('admin/fetchData', async (view, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/admin/${view}`, { withCredentials: true });
        return { view, data: response.data[view] || response.data[view.slice(0, -1)] };
    } catch (error) {
        return rejectWithValue(error.response?.data.message || `Failed to fetch ${view}`);
    }
});

export const addMenuItem = createAsyncThunk('admin/addMenuItem', async (itemData, { rejectWithValue }) => {
    try {
        const { data } = await axios.post(`${API_BASE_URL}/admin/menu`, itemData, { withCredentials: true });
        return data.product;
    } catch (error) {
        return rejectWithValue(error.response?.data.message || 'Failed to add item');
    }
});

export const updateMenuItem = createAsyncThunk('admin/updateMenuItem', async ({ id, itemData }, { rejectWithValue }) => {
    try {
        const { data } = await axios.put(`${API_BASE_URL}/admin/menu/${id}`, itemData, { withCredentials: true });
        return data.product;
    } catch (error) {
        return rejectWithValue(error.response?.data.message || 'Failed to update item');
    }
});

export const deleteMenuItem = createAsyncThunk('admin/deleteMenuItem', async (id, { rejectWithValue }) => {
    try {
        await axios.delete(`${API_BASE_URL}/admin/menu/${id}`, { withCredentials: true });
        return id;
    } catch (error) {
        return rejectWithValue(error.response?.data.message || 'Failed to delete item');
    }
});

export const updateOrderStatus = createAsyncThunk(
    'admin/updateOrderStatus',
    async ({ orderId, status }, { rejectWithValue }) => {
        try {
            const { data } = await axios.put(`${API_BASE_URL}/admin/orders/${orderId}/status`, { status }, { withCredentials: true });
            return data.order;
        } catch (error) {
            return rejectWithValue(error.response?.data.message || 'Failed to update status');
        }
    }
);

export const createOrder = createAsyncThunk(
    'admin/createOrder',
    async (orderData, { rejectWithValue }) => {
        try {
            const { data } = await axios.post(`${API_BASE_URL}/admin/orders`, orderData, { withCredentials: true });
            return data.order;
        } catch (error) {
            return rejectWithValue(error.response?.data.message || 'Failed to create order');
        }
    }
);

const initialState = {
    orders: [],
    menu: [],
    customers: [],
    analytics: null,
    status: 'idle',
    error: null,
};

const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAdminData.pending, (state) => { state.status = 'loading'; })
            .addCase(fetchAdminData.fulfilled, (state, action) => {
                state.status = 'succeeded';
                if(action.payload.view && action.payload.data) {
                    state[action.payload.view] = action.payload.data;
                }
            })
            .addCase(fetchAdminData.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload; })
            .addCase(addMenuItem.fulfilled, (state, action) => { state.menu.push(action.payload); })
            .addCase(updateMenuItem.fulfilled, (state, action) => {
                const index = state.menu.findIndex(item => item._id === action.payload._id);
                if (index !== -1) { state.menu[index] = action.payload; }
            })
            .addCase(deleteMenuItem.fulfilled, (state, action) => {
                state.menu = state.menu.filter(item => item._id !== action.payload);
            })
            .addCase(updateOrderStatus.fulfilled, (state, action) => {
                const index = state.orders.findIndex(order => order._id === action.payload._id);
                if (index !== -1) { state.orders[index] = action.payload; }
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.orders.unshift(action.payload);
});
    }
});

export default adminSlice.reducer;