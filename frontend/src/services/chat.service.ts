import api from "./api";
import { io, Socket } from "socket.io-client";

export interface Session {
  _id: string;
  sessionId: string;
  userId: string;
  agentId?: string;
  status: string;
  channel?: string;
  createdAt: string;
  connectedAt?: string;
  endedAt?: string;
}

export interface Message {
  id?: string;
  sessionId: string;
  senderId: string;
  content: string;
  type?: string;
  createdAt: string;
}

class ChatService {
  private socket: Socket | null = null;
  private socketUrl = import.meta.env.VITE_WS_URL || "http://localhost:3000";

  connect(userId: string) {
    if (this.socket?.connected) {
      return this.socket;
    }

    this.socket = io(`${this.socketUrl}/chat`, {
      auth: { userId },
      transports: ["websocket", "polling"]
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  async getSessions(): Promise<Session[]> {
    const response = await api.get("/chat/sessions");
    return response.data;
  }

  async getSession(sessionId: string): Promise<Session> {
    const response = await api.get(`/chat/sessions/${sessionId}`);
    return response.data;
  }

  async getMessages(sessionId: string): Promise<Message[]> {
    const response = await api.get(`/chat/sessions/${sessionId}/messages`);
    return response.data;
  }
}

export const chatService = new ChatService();

