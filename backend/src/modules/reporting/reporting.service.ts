import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Ticket, TicketDocument } from "../../common/schemas/ticket.schema";
import { Session, SessionDocument } from "../../common/schemas/session.schema";
import { User, UserDocument } from "../../common/schemas/user.schema";

@Injectable()
export class ReportingService {
  constructor(
    @InjectModel(Ticket.name) private ticketModel: Model<TicketDocument>,
    @InjectModel(Session.name) private sessionModel: Model<SessionDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>
  ) {}

  async getDashboardStats() {
    const [
      totalTickets,
      openTickets,
      resolvedTickets,
      totalSessions,
      activeSessions,
      totalAgents,
      activeAgents
    ] = await Promise.all([
      this.ticketModel.countDocuments().exec(),
      this.ticketModel.countDocuments({ status: { $in: ["open", "assigned", "in_progress"] } }).exec(),
      this.ticketModel.countDocuments({ status: "resolved" }).exec(),
      this.sessionModel.countDocuments().exec(),
      this.sessionModel.countDocuments({ status: "connected" }).exec(),
      this.userModel.countDocuments({ role: "agent" }).exec(),
      this.userModel.countDocuments({ role: "agent", active: true }).exec()
    ]);

    return {
      tickets: {
        total: totalTickets,
        open: openTickets,
        resolved: resolvedTickets,
        resolutionRate: totalTickets > 0 ? (resolvedTickets / totalTickets) * 100 : 0
      },
      sessions: {
        total: totalSessions,
        active: activeSessions
      },
      agents: {
        total: totalAgents,
        active: activeAgents
      }
    };
  }

  async getTicketStats(startDate?: Date, endDate?: Date) {
    const query: any = {};
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = startDate;
      if (endDate) query.createdAt.$lte = endDate;
    }

    const tickets = await this.ticketModel.find(query).exec();
    
    const stats = {
      byStatus: {} as Record<string, number>,
      byPriority: {} as Record<string, number>,
      byChannel: {} as Record<string, number>,
      avgResolutionTime: 0,
      total: tickets.length
    };

    let totalResolutionTime = 0;
    let resolvedCount = 0;

    tickets.forEach(ticket => {
      stats.byStatus[ticket.status] = (stats.byStatus[ticket.status] || 0) + 1;
      stats.byPriority[ticket.priority] = (stats.byPriority[ticket.priority] || 0) + 1;
      if (ticket.channel) {
        stats.byChannel[ticket.channel] = (stats.byChannel[ticket.channel] || 0) + 1;
      }
      if (ticket.resolutionTime && ticket.resolutionTime > 0) {
        totalResolutionTime += ticket.resolutionTime;
        resolvedCount++;
      }
    });

    stats.avgResolutionTime = resolvedCount > 0 ? totalResolutionTime / resolvedCount : 0;

    return stats;
  }
}

