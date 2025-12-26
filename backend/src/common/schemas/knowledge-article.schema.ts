import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type KnowledgeArticleDocument = KnowledgeArticle & Document;

export enum ArticleStatus {
  DRAFT = "draft",
  PUBLISHED = "published",
  ARCHIVED = "archived"
}

@Schema({ timestamps: true })
export class KnowledgeArticle {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop()
  summary?: string;

  @Prop({ type: String, enum: ArticleStatus, default: ArticleStatus.DRAFT })
  status: ArticleStatus;

  @Prop({ type: [String], default: [] })
  categories: string[];

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ type: String, ref: "User" })
  authorId: string;

  @Prop()
  authorName?: string;

  @Prop({ default: 0 })
  viewCount: number;

  @Prop({ default: 0 })
  helpfulCount: number;

  @Prop({ default: 0 })
  notHelpfulCount: number;

  @Prop({ type: [String], default: [] })
  attachments: string[];

  @Prop({ type: Object, default: {} })
  metadata: Record<string, any>;

  @Prop()
  publishedAt?: Date;
}

export const KnowledgeArticleSchema = SchemaFactory.createForClass(KnowledgeArticle);
KnowledgeArticleSchema.index({ status: 1, createdAt: -1 });
KnowledgeArticleSchema.index({ categories: 1, tags: 1 });
KnowledgeArticleSchema.index({ title: "text", content: "text" });

