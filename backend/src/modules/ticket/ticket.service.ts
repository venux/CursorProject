import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Ticket, TicketDocument, TicketStatus, TicketPriority } from "../../common/schemas/ticket.schema";
import { CreateTicketDto } from "./dto/create-ticket.dto";
import { UpdateTicketDto } from "./dto/update-ticket.dto";

@Injectable()
export class TicketService {
  private ticketCounter = 1000;

  constructor(@InjectModel(Ticket.name) private ticketModel: Model<TicketDocument>) {}

  async create(createDto: CreateTicketDto, userId: string): Promise<TicketDocument> {
    const ticketId = `TCK-${Date.now()}-${++this.ticketCounter}`;
    const ticket = await this.ticketModel.create({
      ...createDto,
      ticketId,
      userId,
      status: TicketStatus.OPEN,
      priority: createDto.priority || TicketPriority.MEDIUM,
      tags: createDto.tags || [],
      attachments: createDto.attachments || []
    });
    return ticket;
  }

  async findAll(userId?: string, role?: string, filters?: {
    status?: TicketStatus;
    assignedTo?: string;
    priority?: TicketPriority;
    page?: number;
    limit?: number;
  }): Promise<{ tickets: TicketDocument[]; total: number }> {
    const query: any = {};
    
    // 用户只能看自己的工单，Agent和Admin可以看所有
    if (role === "user" && userId) {
      query.userId = userId;
    }
    
    if (filters?.status) {
      query.status = filters.status;
    }
    
    if (filters?.assignedTo) {
      query.assignedTo = filters.assignedTo;
    }
    
    if (filters?.priority) {
      query.priority = filters.priority;
    }

    const page = filters?.page || 1;
    const limit = filters?.limit || 20;
    const skip = (page - 1) * limit;

    const [tickets, total] = await Promise.all([
      this.ticketModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
      this.ticketModel.countDocuments(query).exec()
    ]);

    return { tickets, total };
  }

  async findOne(id: string, userId?: string, role?: string): Promise<TicketDocument> {
    const ticket = await this.ticketModel.findById(id).exec();
    if (!ticket) {
      throw new NotFoundException("工单不存在");
    }
    
    // 权限检查
    if (role === "user" && ticket.userId !== userId) {
      throw new ForbiddenException("无权访问此工单");
    }
    
    return ticket;
  }

  async update(id: string, updateDto: UpdateTicketDto, userId: string, role: string): Promise<TicketDocument> {
    const ticket = await this.findOne(id, userId, role);
    
    // 用户只能更新自己的工单的某些字段
    if (role === "user") {
      const allowedFields = ["title", "description", "tags"];
      const updateData: any = {};
      for (const field of allowedFields) {
        const value = (updateDto as any)[field];
        if (value !== undefined) {
          (ticket as any)[field] = value;
        }
      }
    } else {
      // Agent和Admin可以更新所有字段
      Object.assign(ticket, updateDto);
      
      // 状态变更时更新时间戳
      if (updateDto.status === TicketStatus.RESOLVED) {
        ticket.resolvedAt = new Date();
      } else if (updateDto.status === TicketStatus.CLOSED) {
        ticket.closedAt = new Date();
      }
    }
    
    await ticket.save();
    return ticket;
  }

  async assign(id: string, agentId: string, userId: string, role: string): Promise<TicketDocument> {
    if (role !== "admin" && role !== "agent") {
      throw new ForbiddenException("无权分配工单");
    }
    
    const ticket = await this.findOne(id);
    ticket.assignedTo = agentId;
    ticket.status = TicketStatus.ASSIGNED;
    await ticket.save();
    return ticket;
  }

  async close(id: string, userId: string, role: string): Promise<TicketDocument> {
    const ticket = await this.findOne(id, userId, role);
    ticket.status = TicketStatus.CLOSED;
    ticket.closedAt = new Date();
    await ticket.save();
    return ticket;
  }

  async reopen(id: string, userId: string): Promise<TicketDocument> {
    const ticket = await this.findOne(id, userId);
    if (ticket.status !== TicketStatus.CLOSED) {
      throw new Error("只能重新打开已关闭的工单");
    }
    ticket.status = TicketStatus.REOPENED;
    await ticket.save();
    return ticket;
  }
}

