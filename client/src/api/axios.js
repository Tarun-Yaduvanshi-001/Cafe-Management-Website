import axios from 'axios';
import store from '../redux/store'; // Import your Redux store

// Create a base instance of Axios
const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Your backend API base URL
});

// Use an interceptor to add the token to every request
api.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.token; // Get the token from the Redux store
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;