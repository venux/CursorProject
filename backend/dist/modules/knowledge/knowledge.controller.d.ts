import { KnowledgeService, Article } from "./knowledge.service";
export declare class KnowledgeController {
    private readonly knowledgeService;
    constructor(knowledgeService: KnowledgeService);
    findAll(): Article[];
}
