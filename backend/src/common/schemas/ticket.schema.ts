import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type TicketDocument = Ticket & Document;

export enum TicketStatus {
  OPEN = "open",
  ASSIGNED = "assigned",
  IN_PROGRESS = "in_progress",
  WAITING_USER = "waiting_user",
  RESOLVED = "resolved",
  CLOSED = "closed",
  REOPENED = "reopened"
}

export enum TicketPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  URGENT = "urgent"
}

@Schema({ timestamps: true })
export class Ticket {
  @Prop({ required: true, unique: true })
  ticketId: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, type: String, ref: "User" })
  userId: string;

  @Prop({ type: String, ref: "User" })
  assignedTo?: string;

  @Prop({ type: String, enum: TicketStatus, default: TicketStatus.OPEN })
  status: TicketStatus;

  @Prop({ type: String, enum: TicketPriority, default: TicketPriority.MEDIUM })
  priority: TicketPriority;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ type: [String], default: [] })
  attachments: string[];

  @Prop()
  category?: string;

  @Prop()
  channel?: string;

  @Prop()
  queueId?: string;

  @Prop({ type: Object, default: {} })
  metadata: Record<string, any>;

  @Prop()
  resolvedAt?: Date;

  @Prop()
  closedAt?: Date;

  @Prop()
  slaDueAt?: Date;

  @Prop({ default: 0 })
  responseTime?: number;

  @Prop({ default: 0 })
  resolutionTime?: number;
}

export const TicketSchema = SchemaFactory.createForClass(Ticket);
TicketSchema.index({ userId: 1, status: 1, updatedAt: -1 });
TicketSchema.index({ assignedTo: 1, status: 1 });
TicketSchema.index({ status: 1, priority: 1, createdAt: -1 });
TicketSchema.index({ ticketId: 1 });

