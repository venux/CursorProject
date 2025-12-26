import api from "./api";

export interface Notification {
  _id: string;
  userId: string;
  type: string;
  channel: string;
  title: string;
  content: string;
  read: boolean;
  readAt?: string;
  createdAt: string;
}

export const notificationService = {
  async findAll(unreadOnly = false): Promise<Notification[]> {
    const response = await api.get("/notifications", {
      params: { unread: unreadOnly }
    });
    return response.data;
  },

  async markAsRead(id: string): Promise<Notification> {
    const response = await api.patch(`/notifications/${id}/read`);
    return response.data;
  },

  async markAllAsRead(): Promise<void> {
    await api.patch("/notifications/read-all");
  }
};

