// frontend/src/api/axios.js
import axios from "axios";

// base axios so we don't repeat baseURL everywhere
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: false,
});

export default api;
