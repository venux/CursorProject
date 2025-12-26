import { IsString, IsNotEmpty, IsOptional, IsArray, IsEnum } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { TicketPriority } from "../../../common/schemas/ticket.schema";

export class CreateTicketDto {
  @ApiProperty({ description: "工单标题" })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: "工单描述" })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: "优先级", enum: TicketPriority, required: false })
  @IsOptional()
  @IsEnum(TicketPriority)
  priority?: TicketPriority;

  @ApiProperty({ description: "标签", type: [String], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiProperty({ description: "分类", required: false })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({ description: "渠道", required: false })
  @IsOptional()
  @IsString()
  channel?: string;

  @ApiProperty({ description: "附件URL列表", type: [String], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  attachments?: string[];
}

