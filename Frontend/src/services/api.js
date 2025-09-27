// src/services/api.js
import axios from "axios";

// Normalize to avoid trailing slashes doubling when joining with path
const RAW_BASE = import.meta.env.DEV
  ? "/api"
  : (import.meta.env.VITE_API_BASE ?? "https://localhost:5000/api");
const API_BASE = RAW_BASE.replace(/\/+$/, ""); // strip trailing slash

export async function api(path, options = {}) {
  try {
    const token = (typeof localStorage !== "undefined") ? localStorage.getItem("token") : null;

    // ensure leading slash for path
    const p = path.startsWith("/") ? path : `/${path}`;

    const res = await axios({
      url: `${API_BASE}${p}`,
      method: options.method || "GET",
      data: options.body || undefined,        // Axios serializes JSON for application/json
      params: options.params || undefined,    // optional query params passthrough
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...(options.headers || {}),
      },
      withCredentials: true,                  // send cookies when server CORS allows credentials
      timeout: options.timeout ?? 15000,      // sensible default timeout
      ...options,                             // allow overriding any axios config
    });

    return res.data; // Axios places parsed response body here
  } catch (err) {
    if (err.response) {
      throw new Error(err.response.data?.message || `HTTP ${err.response.status}`);
    } else if (err.request) {
      throw new Error("Network Error: Could not reach the server");
    } else {
      throw new Error(err.message);
    }
  }
}
