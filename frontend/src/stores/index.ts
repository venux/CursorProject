import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: "",
    role: "",
    user: null as null | { id: string; name: string }
  }),
  actions: {
    setAuth(payload: { token: string; role: string; user: { id: string; name: string } }) {
      this.token = payload.token;
      this.role = payload.role;
      this.user = payload.user;
    },
    clear() {
      this.token = "";
      this.role = "";
      this.user = null;
    }
  }
});

