import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  Request
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { TicketService } from "./ticket.service";
import { CreateTicketDto } from "./dto/create-ticket.dto";
import { UpdateTicketDto } from "./dto/update-ticket.dto";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { TicketStatus, TicketPriority } from "../../common/schemas/ticket.schema";

@ApiTags("工单管理")
@Controller("tickets")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth("access-token")
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Post()
  @ApiOperation({ summary: "创建工单" })
  async create(@Body() createDto: CreateTicketDto, @Request() req: any) {
    return this.ticketService.create(createDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: "获取工单列表" })
  async findAll(
    @Query("status") status?: TicketStatus,
    @Query("assignedTo") assignedTo?: string,
    @Query("priority") priority?: TicketPriority,
    @Query("page") page?: string,
    @Query("limit") limit?: string,
    @Request() req?: any
  ) {
    return this.ticketService.findAll(req.user.id, req.user.role, {
      status,
      assignedTo,
      priority,
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined
    });
  }

  @Get(":id")
  @ApiOperation({ summary: "获取工单详情" })
  async findOne(@Param("id") id: string, @Request() req: any) {
    return this.ticketService.findOne(id, req.user.id, req.user.role);
  }

  @Put(":id")
  @ApiOperation({ summary: "更新工单" })
  async update(
    @Param("id") id: string,
    @Body() updateDto: UpdateTicketDto,
    @Request() req: any
  ) {
    return this.ticketService.update(id, updateDto, req.user.id, req.user.role);
  }

  @Patch(":id/assign")
  @ApiOperation({ summary: "分配工单" })
  @UseGuards(RolesGuard)
  @Roles("admin", "agent")
  async assign(
    @Param("id") id: string,
    @Body("agentId") agentId: string,
    @Request() req: any
  ) {
    return this.ticketService.assign(id, agentId, req.user.id, req.user.role);
  }

  @Patch(":id/close")
  @ApiOperation({ summary: "关闭工单" })
  async close(@Param("id") id: string, @Request() req: any) {
    return this.ticketService.close(id, req.user.id, req.user.role);
  }

  @Patch(":id/reopen")
  @ApiOperation({ summary: "重新打开工单" })
  async reopen(@Param("id") id: string, @Request() req: any) {
    return this.ticketService.reopen(id, req.user.id);
  }
}

