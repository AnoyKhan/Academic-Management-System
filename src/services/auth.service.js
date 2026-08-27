import { http } from "./http";

export const authService = {
  login: (payload) => http.post("/auth/login", payload),
};
