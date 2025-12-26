import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { KnowledgeController } from "./knowledge.controller";
import { KnowledgeService } from "./knowledge.service";
import { KnowledgeArticle, KnowledgeArticleSchema } from "../../common/schemas/knowledge-article.schema";
import { AuthModule } from "../../modules/auth/auth.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: KnowledgeArticle.name, schema: KnowledgeArticleSchema }
    ]),
    AuthModule
  ],
  controllers: [KnowledgeController],
  providers: [KnowledgeService],
  exports: [KnowledgeService]
})
export class KnowledgeModule {}

