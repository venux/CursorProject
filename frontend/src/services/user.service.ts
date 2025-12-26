import api from "./api";

export interface User {
  id: string;
  username: string;
  email: string;
  displayName?: string;
  avatar?: string;
  role: string;
  preferences?: Record<string, any>;
}

export interface Agent extends User {
  active: boolean;
}

export const userService = {
  async getProfile(): Promise<User> {
    const response = await api.get("/users/profile");
    return response.data;
  },

  async updateProfile(data: {
    displayName?: string;
    avatar?: string;
    preferences?: Record<string, any>;
  }): Promise<User> {
    const response = await api.put("/users/profile", data);
    return response.data;
  },

  async getAgents(): Promise<Agent[]> {
    const response = await api.get("/users/agents");
    return response.data;
  }
};

