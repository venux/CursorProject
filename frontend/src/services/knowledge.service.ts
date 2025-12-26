import api from "./api";

export interface CreateArticleDto {
  title: string;
  content: string;
  summary?: string;
  status?: "draft" | "published" | "archived";
  categories?: string[];
  tags?: string[];
  attachments?: string[];
}

export interface KnowledgeArticle {
  _id: string;
  title: string;
  content: string;
  summary?: string;
  status: string;
  categories: string[];
  tags: string[];
  authorId: string;
  authorName?: string;
  viewCount: number;
  helpfulCount: number;
  notHelpfulCount: number;
  createdAt: string;
  updatedAt: string;
}

export const knowledgeService = {
  async create(data: CreateArticleDto): Promise<KnowledgeArticle> {
    const response = await api.post("/knowledge", data);
    return response.data;
  },

  async findAll(params?: {
    status?: string;
    category?: string;
    tag?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{ articles: KnowledgeArticle[]; total: number }> {
    const response = await api.get("/knowledge", { params });
    return response.data;
  },

  async findOne(id: string): Promise<KnowledgeArticle> {
    const response = await api.get(`/knowledge/${id}`);
    return response.data;
  },

  async update(id: string, data: Partial<CreateArticleDto>): Promise<KnowledgeArticle> {
    const response = await api.put(`/knowledge/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/knowledge/${id}`);
  },

  async rate(id: string, helpful: boolean): Promise<KnowledgeArticle> {
    const response = await api.post(`/knowledge/${id}/rate`, { helpful });
    return response.data;
  }
};

