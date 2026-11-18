import axios from "axios";

// Backend ka base URL .env (VITE_API_URL) se aata hai
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  timeout: 15000,
});

export const TOKEN_KEY = "gpc_admin_token";

// Har request ke saath admin token (agar hai) bhejo
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Error se user ko dikhane layak message nikalta hai
export const errMsg = (err) =>
  err?.response?.data?.message ||
  (err?.code === "ECONNABORTED" || err?.message === "Network Error"
    ? "Server se connect nahi ho pa raha. Thodi der baad try karein."
    : err?.message) ||
  "Kuch galat ho gaya";

// ---- Public APIs ----
export const getContent = () => api.get("/content").then((r) => r.data.data);
export const getDoctors = () => api.get("/doctors").then((r) => r.data.data);
export const getServices = () => api.get("/services").then((r) => r.data.data);
export const getReviews = () => api.get("/reviews").then((r) => r.data.data);
export const getGallery = () => api.get("/gallery").then((r) => r.data.data);
export const bookAppointment = (payload) => api.post("/appointments", payload).then((r) => r.data);
export const sendEnquiry = (payload) => api.post("/enquiries", payload).then((r) => r.data);
export const submitReview = (payload) => api.post("/reviews", payload).then((r) => r.data);

// ---- Auth ----
export const loginAdmin = (payload) => api.post("/auth/login", payload).then((r) => r.data);
export const fetchMe = () => api.get("/auth/me").then((r) => r.data.admin);

// ---- Admin APIs ----
export const adminGet = (path) => api.get(`/admin${path}`).then((r) => r.data.data);
export const adminPost = (path, body) => api.post(`/admin${path}`, body).then((r) => r.data.data);
export const adminPut = (path, body) => api.put(`/admin${path}`, body).then((r) => r.data.data);
export const adminPatch = (path, body) => api.patch(`/admin${path}`, body).then((r) => r.data.data);
export const adminDelete = (path) => api.delete(`/admin${path}`).then((r) => r.data);

export default api;
