import axios from "axios";
import { dummyAuthService } from "./dummy-auth";

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "/api",
  timeout: 15000,
});

http.interceptors.request.use((config) => {
  const session = dummyAuthService.getSession();

  if (session?.token) {
    config.headers.Authorization = `Bearer ${session.token}`;
  }

  config.headers["X-Requested-With"] = "AMS-Frontend";

  return config;
});

http.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  },
);
