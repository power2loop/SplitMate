// src/services/api.js
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export async function api(path, options = {}) {
  try {
    const token = localStorage.getItem("token"); // your auth token
    const res = await axios({
      url: `${API_BASE}${path}`,
      method: options.method || "GET",
      data: options.body || undefined,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      withCredentials: true, // if backend uses cookies
      ...options,
    });

    return res.data; // Axios returns data here
  } catch (err) {
    if (err.response) {
      // Server responded with status code outside 2xx
      throw new Error(err.response.data?.message || `HTTP ${err.response.status}`);
    } else if (err.request) {
      // Request was made but no response received
      throw new Error("Network Error: Could not reach the server");
    } else {
      // Other errors
      throw new Error(err.message);
    }
  }
}
