import { defineStore } from "pinia";
import type { User } from "../services/user.service";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: localStorage.getItem("token") || "",
    role: localStorage.getItem("role") || "",
    user: null as User | null
  }),
  getters: {
    isAuthenticated: (state) => !!state.token && !!state.user,
    isAdmin: (state) => state.role === "admin",
    isAgent: (state) => state.role === "agent",
    isUser: (state) => state.role === "user"
  },
  actions: {
    setAuth(payload: { token: string; role: string; user: User }) {
      this.token = payload.token;
      this.role = payload.role;
      this.user = payload.user;
      localStorage.setItem("token", payload.token);
      localStorage.setItem("role", payload.role);
    },
    setUser(user: User) {
      this.user = user;
    },
    clear() {
      this.token = "";
      this.role = "";
      this.user = null;
      localStorage.removeItem("token");
      localStorage.removeItem("role");
    }
  }
});

