import { Injectable } from "@nestjs/common";

export interface Article {
  id: string;
  title: string;
  tags: string[];
}

@Injectable()
export class KnowledgeService {
  private articles: Article[] = [{ id: "KB-1", title: "示例文章", tags: ["faq"] }];

  findAll() {
    return this.articles;
  }
}

