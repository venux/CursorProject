import { IsString, IsOptional, IsEnum, IsArray } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { TicketStatus, TicketPriority } from "../../../common/schemas/ticket.schema";

export class UpdateTicketDto {
  @ApiProperty({ description: "标题", required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ description: "描述", required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: "状态", enum: TicketStatus, required: false })
  @IsOptional()
  @IsEnum(TicketStatus)
  status?: TicketStatus;

  @ApiProperty({ description: "优先级", enum: TicketPriority, required: false })
  @IsOptional()
  @IsEnum(TicketPriority)
  priority?: TicketPriority;

  @ApiProperty({ description: "标签", type: [String], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiProperty({ description: "分配给", required: false })
  @IsOptional()
  @IsString()
  assignedTo?: string;
}

