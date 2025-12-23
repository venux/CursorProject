import { Controller, Get } from "@nestjs/common";
import { KnowledgeService, Article } from "./knowledge.service";

@Controller("knowledge")
export class KnowledgeController {
  constructor(private readonly knowledgeService: KnowledgeService) {}

  @Get()
  findAll(): Article[] {
    return this.knowledgeService.findAll();
  }
}

