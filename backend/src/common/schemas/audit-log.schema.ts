import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type AuditLogDocument = AuditLog & Document;

export enum AuditAction {
  LOGIN = "login",
  LOGOUT = "logout",
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  ASSIGN = "assign",
  TRANSFER = "transfer",
  ESCALATE = "escalate",
  PERMISSION_CHANGE = "permission_change",
  ROLE_CHANGE = "role_change"
}

@Schema({ timestamps: true })
export class AuditLog {
  @Prop({ required: true, type: String, ref: "User" })
  userId: string;

  @Prop()
  username?: string;

  @Prop({ required: true, type: String, enum: AuditAction })
  action: AuditAction;

  @Prop({ required: true })
  resource: string;

  @Prop()
  resourceId?: string;

  @Prop({ type: Object, default: {} })
  changes: Record<string, any>;

  @Prop({ type: Object, default: {} })
  metadata: Record<string, any>;

  @Prop()
  ipAddress?: string;

  @Prop()
  userAgent?: string;
}

export const AuditLogSchema = SchemaFactory.createForClass(AuditLog);
AuditLogSchema.index({ userId: 1, createdAt: -1 });
AuditLogSchema.index({ resource: 1, resourceId: 1, createdAt: -1 });
AuditLogSchema.index({ action: 1, createdAt: -1 });
AuditLogSchema.index({ createdAt: -1 });

