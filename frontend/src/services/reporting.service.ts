import api from "./api";

export interface DashboardStats {
  tickets: {
    total: number;
    open: number;
    resolved: number;
    resolutionRate: number;
  };
  sessions: {
    total: number;
    active: number;
  };
  agents: {
    total: number;
    active: number;
  };
}

export interface TicketStats {
  byStatus: Record<string, number>;
  byPriority: Record<string, number>;
  byChannel: Record<string, number>;
  avgResolutionTime: number;
  total: number;
}

export const reportingService = {
  async getDashboard(): Promise<DashboardStats> {
    const response = await api.get("/reporting/dashboard");
    return response.data;
  },

  async getTicketStats(startDate?: string, endDate?: string): Promise<TicketStats> {
    const response = await api.get("/reporting/tickets", {
      params: { startDate, endDate }
    });
    return response.data;
  }
};

