// src/utils/axios.js
import axios from 'axios';

// ----------------------------------------------------------------------

// const axiosInstance = axios.create({ baseURL: process.env.HOST_API_KEY || '' });
// const axiosInstance = axios.create({ baseURL: 'http://localhost:5000' || '' });
const axiosInstance = axios.create({ baseURL: process.env.NEXT_PUBLIC_HOST_API_KEY || '' });


axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);

export default axiosInstance;
