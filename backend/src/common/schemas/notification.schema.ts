import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type NotificationDocument = Notification & Document;

export enum NotificationType {
  TICKET_CREATED = "ticket_created",
  TICKET_UPDATED = "ticket_updated",
  TICKET_ASSIGNED = "ticket_assigned",
  TICKET_RESOLVED = "ticket_resolved",
  MESSAGE_RECEIVED = "message_received",
  SYSTEM_ANNOUNCEMENT = "system_announcement"
}

export enum NotificationChannel {
  IN_APP = "in_app",
  EMAIL = "email",
  SMS = "sms",
  WEBHOOK = "webhook"
}

@Schema({ timestamps: true })
export class Notification {
  @Prop({ required: true, type: String, ref: "User" })
  userId: string;

  @Prop({ required: true, type: String, enum: NotificationType })
  type: NotificationType;

  @Prop({ required: true, type: String, enum: NotificationChannel })
  channel: NotificationChannel;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ default: false })
  read: boolean;

  @Prop()
  readAt?: Date;

  @Prop({ type: Object, default: {} })
  data: Record<string, any>;

  @Prop()
  resourceType?: string;

  @Prop()
  resourceId?: string;

  @Prop({ default: false })
  sent: boolean;

  @Prop()
  sentAt?: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
NotificationSchema.index({ userId: 1, read: 1, createdAt: -1 });
NotificationSchema.index({ type: 1, channel: 1, sent: 1 });

