import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE,
  timeout: 10000,
});

// Simple request interceptor to add tracing headers
api.interceptors.request.use((config) => {
  config.headers["X-Client-Request-Id"] = crypto.randomUUID();
  return config;
});
