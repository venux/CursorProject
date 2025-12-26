import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { KnowledgeService } from "./knowledge.service";
import { CreateArticleDto } from "./dto/create-article.dto";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { ArticleStatus } from "../../common/schemas/knowledge-article.schema";

@ApiTags("知识库管理")
@Controller("knowledge")
export class KnowledgeController {
  constructor(private readonly knowledgeService: KnowledgeService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin", "agent")
  @ApiBearerAuth("access-token")
  @ApiOperation({ summary: "创建文章" })
  async create(@Body() createDto: CreateArticleDto, @Request() req: any) {
    return this.knowledgeService.create(createDto, req.user.id, req.user.displayName || req.user.username);
  }

  @Get()
  @ApiOperation({ summary: "获取文章列表" })
  async findAll(
    @Query("status") status?: ArticleStatus,
    @Query("category") category?: string,
    @Query("tag") tag?: string,
    @Query("search") search?: string,
    @Query("page") page?: string,
    @Query("limit") limit?: string
  ) {
    return this.knowledgeService.findAll({
      status,
      category,
      tag,
      search,
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined
    });
  }

  @Get(":id")
  @ApiOperation({ summary: "获取文章详情" })
  async findOne(@Param("id") id: string) {
    return this.knowledgeService.findOne(id);
  }

  @Put(":id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("access-token")
  @ApiOperation({ summary: "更新文章" })
  async update(
    @Param("id") id: string,
    @Body() updateDto: Partial<CreateArticleDto>,
    @Request() req: any
  ) {
    return this.knowledgeService.update(id, updateDto, req.user.id, req.user.role);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("access-token")
  @ApiOperation({ summary: "删除文章" })
  async delete(@Param("id") id: string, @Request() req: any) {
    await this.knowledgeService.delete(id, req.user.id, req.user.role);
    return { message: "删除成功" };
  }

  @Post(":id/rate")
  @ApiOperation({ summary: "评价文章" })
  async rate(@Param("id") id: string, @Body("helpful") helpful: boolean) {
    return this.knowledgeService.rateHelpful(id, helpful);
  }
}

