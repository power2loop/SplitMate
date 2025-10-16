import axios from "axios";

const RAW_BASE = import.meta.env.DEV
  ? "/api"
  : (import.meta.env.VITE_API_BASE ?? import.meta.env.VITE_BACKEND_URL);

const API_BASE = RAW_BASE.replace(/\/+$/, "");

export async function api(path, options = {}) {
  try {
    const token = typeof localStorage !== "undefined" ? localStorage.getItem("token") : null;
    const p = path.startsWith("/") ? path : `/${path}`;

    const res = await axios({
      url: `${API_BASE}${p}`,
      method: options.method || "GET",
      data: options.body || undefined,
      params: options.params || undefined,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...(options.headers || {}),
      },
      withCredentials: true,
      timeout: options.timeout ?? 15000,
      ...options,
    });

    return res.data;
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
