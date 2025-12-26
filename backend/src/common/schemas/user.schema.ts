import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type UserDocument = User & Document;

export enum UserRole {
  USER = "user",
  AGENT = "agent",
  ADMIN = "admin"
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  keycloakId!: string;

  @Prop({ required: true })
  username!: string;

  @Prop({ required: true })
  email!: string;

  @Prop()
  displayName?: string;

  @Prop()
  avatar?: string;

  @Prop({ type: String, enum: UserRole, default: UserRole.USER })
  role!: UserRole;

  @Prop({ type: [String], default: [] })
  permissions!: string[];

  @Prop({ type: Object, default: {} })
  preferences!: Record<string, any>;

  @Prop({ default: true })
  active!: boolean;

  @Prop()
  lastLoginAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index({ keycloakId: 1 });
UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });

