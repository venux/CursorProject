import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import {
  KnowledgeArticle,
  KnowledgeArticleDocument,
  ArticleStatus
} from "../../common/schemas/knowledge-article.schema";
import { CreateArticleDto } from "./dto/create-article.dto";

@Injectable()
export class KnowledgeService {
  constructor(
    @InjectModel(KnowledgeArticle.name)
    private articleModel: Model<KnowledgeArticleDocument>
  ) {}

  async create(createDto: CreateArticleDto, userId: string, username: string): Promise<KnowledgeArticleDocument> {
    const article = await this.articleModel.create({
      ...createDto,
      authorId: userId,
      authorName: username,
      status: createDto.status || ArticleStatus.DRAFT,
      categories: createDto.categories || [],
      tags: createDto.tags || [],
      attachments: createDto.attachments || [],
      viewCount: 0,
      helpfulCount: 0,
      notHelpfulCount: 0
    });
    return article;
  }

  async findAll(filters?: {
    status?: ArticleStatus;
    category?: string;
    tag?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{ articles: KnowledgeArticleDocument[]; total: number }> {
    const query: any = {};

    // 用户端只显示已发布的文章
    if (filters?.status) {
      query.status = filters.status;
    } else {
      query.status = ArticleStatus.PUBLISHED;
    }

    if (filters?.category) {
      query.categories = filters.category;
    }

    if (filters?.tag) {
      query.tags = filters.tag;
    }

    if (filters?.search) {
      query.$text = { $search: filters.search };
    }

    const page = filters?.page || 1;
    const limit = filters?.limit || 20;
    const skip = (page - 1) * limit;

    const [articles, total] = await Promise.all([
      this.articleModel
        .find(query)
        .sort(filters?.search ? { score: { $meta: "textScore" } } : { createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.articleModel.countDocuments(query).exec()
    ]);

    return { articles, total };
  }

  async findOne(id: string): Promise<KnowledgeArticleDocument> {
    const article = await this.articleModel.findById(id).exec();
    if (!article) {
      throw new NotFoundException("文章不存在");
    }
    // 增加浏览次数
    article.viewCount += 1;
    await article.save();
    return article;
  }

  async update(
    id: string,
    updateDto: Partial<CreateArticleDto>,
    userId: string,
    role: string
  ): Promise<KnowledgeArticleDocument> {
    const article = await this.articleModel.findById(id).exec();
    if (!article) {
      throw new NotFoundException("文章不存在");
    }

    // 只有作者或管理员可以编辑
    if (article.authorId !== userId && role !== "admin") {
      throw new Error("无权编辑此文章");
    }

    Object.assign(article, updateDto);
    if (updateDto.status === ArticleStatus.PUBLISHED && !article.publishedAt) {
      article.publishedAt = new Date();
    }
    await article.save();
    return article;
  }

  async delete(id: string, userId: string, role: string): Promise<void> {
    const article = await this.articleModel.findById(id).exec();
    if (!article) {
      throw new NotFoundException("文章不存在");
    }

    if (article.authorId !== userId && role !== "admin") {
      throw new Error("无权删除此文章");
    }

    await this.articleModel.findByIdAndDelete(id).exec();
  }

  async rateHelpful(id: string, helpful: boolean): Promise<KnowledgeArticleDocument> {
    const article = await this.articleModel.findById(id).exec();
    if (!article) {
      throw new NotFoundException("文章不存在");
    }

    if (helpful) {
      article.helpfulCount += 1;
    } else {
      article.notHelpfulCount += 1;
    }
    await article.save();
    return article;
  }
}

