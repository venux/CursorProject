import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type MessageDocument = Message & Document;

export enum MessageType {
  TEXT = "text",
  IMAGE = "image",
  FILE = "file",
  SYSTEM = "system"
}

@Schema({ timestamps: true })
export class Message {
  @Prop({ required: true, type: String, ref: "Session" })
  sessionId: string;

  @Prop({ required: true, type: String, ref: "User" })
  senderId: string;

  @Prop()
  senderName?: string;

  @Prop({ required: true, type: String, enum: MessageType, default: MessageType.TEXT })
  type: MessageType;

  @Prop({ required: true })
  content: string;

  @Prop({ type: [String], default: [] })
  attachments: string[];

  @Prop({ default: false })
  read: boolean;

  @Prop()
  readAt?: Date;

  @Prop({ default: false })
  edited: boolean;

  @Prop()
  editedAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
MessageSchema.index({ sessionId: 1, createdAt: 1 });
MessageSchema.index({ senderId: 1, createdAt: -1 });

