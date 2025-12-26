import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type SessionDocument = Session & Document;

export enum SessionStatus {
  QUEUING = "queuing",
  CONNECTED = "connected",
  WAITING = "waiting",
  ENDED = "ended"
}

@Schema({ timestamps: true })
export class Session {
  @Prop({ required: true, unique: true })
  sessionId: string;

  @Prop({ required: true, type: String, ref: "User" })
  userId: string;

  @Prop({ type: String, ref: "User" })
  agentId?: string;

  @Prop({ type: String, enum: SessionStatus, default: SessionStatus.QUEUING })
  status: SessionStatus;

  @Prop()
  queueId?: string;

  @Prop()
  channel?: string;

  @Prop({ type: Object, default: {} })
  userInfo: Record<string, any>;

  @Prop()
  connectedAt?: Date;

  @Prop()
  endedAt?: Date;

  @Prop({ default: 0 })
  messageCount: number;

  @Prop({ default: false })
  rated: boolean;

  @Prop()
  rating?: number;

  @Prop()
  ratingComment?: string;
}

export const SessionSchema = SchemaFactory.createForClass(Session);
SessionSchema.index({ userId: 1, status: 1, createdAt: -1 });
SessionSchema.index({ agentId: 1, status: 1 });
SessionSchema.index({ sessionId: 1 });
SessionSchema.index({ status: 1, createdAt: 1 });

