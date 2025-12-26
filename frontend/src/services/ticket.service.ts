import api from "./api";
import type { TicketStatus, TicketPriority } from "../types/ticket";

export interface CreateTicketDto {
  title: string;
  description: string;
  priority?: TicketPriority;
  tags?: string[];
  category?: string;
  channel?: string;
  attachments?: string[];
}

export interface UpdateTicketDto {
  title?: string;
  description?: string;
  status?: TicketStatus;
  priority?: TicketPriority;
  tags?: string[];
  assignedTo?: string;
}

export interface Ticket {
  _id: string;
  ticketId: string;
  title: string;
  description: string;
  userId: string;
  assignedTo?: string;
  status: TicketStatus;
  priority: TicketPriority;
  tags: string[];
  attachments: string[];
  category?: string;
  channel?: string;
  createdAt: string;
  updatedAt: string;
}

export const ticketService = {
  async create(data: CreateTicketDto): Promise<Ticket> {
    const response = await api.post("/tickets", data);
    return response.data;
  },

  async findAll(params?: {
    status?: TicketStatus;
    assignedTo?: string;
    priority?: TicketPriority;
    page?: number;
    limit?: number;
  }): Promise<{ tickets: Ticket[]; total: number }> {
    const response = await api.get("/tickets", { params });
    return response.data;
  },

  async findOne(id: string): Promise<Ticket> {
    const response = await api.get(`/tickets/${id}`);
    return response.data;
  },

  async update(id: string, data: UpdateTicketDto): Promise<Ticket> {
    const response = await api.put(`/tickets/${id}`, data);
    return response.data;
  },

  async assign(id: string, agentId: string): Promise<Ticket> {
    const response = await api.patch(`/tickets/${id}/assign`, { agentId });
    return response.data;
  },

  async close(id: string): Promise<Ticket> {
    const response = await api.patch(`/tickets/${id}/close`);
    return response.data;
  },

  async reopen(id: string): Promise<Ticket> {
    const response = await api.patch(`/tickets/${id}/reopen`);
    return response.data;
  }
};

