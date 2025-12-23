export interface Article {
    id: string;
    title: string;
    tags: string[];
}
export declare class KnowledgeService {
    private articles;
    findAll(): Article[];
}
