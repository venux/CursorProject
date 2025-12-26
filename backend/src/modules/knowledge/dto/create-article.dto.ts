import { IsString, IsNotEmpty, IsOptional, IsArray, IsEnum } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { ArticleStatus } from "../../../common/schemas/knowledge-article.schema";

export class CreateArticleDto {
  @ApiProperty({ description: "标题" })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: "内容" })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ description: "摘要", required: false })
  @IsOptional()
  @IsString()
  summary?: string;

  @ApiProperty({ description: "状态", enum: ArticleStatus, required: false })
  @IsOptional()
  @IsEnum(ArticleStatus)
  status?: ArticleStatus;

  @ApiProperty({ description: "分类", type: [String], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categories?: string[];

  @ApiProperty({ description: "标签", type: [String], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiProperty({ description: "附件URL列表", type: [String], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  attachments?: string[];
}

