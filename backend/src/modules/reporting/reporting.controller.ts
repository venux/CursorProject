import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { ReportingService } from "./reporting.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";

@ApiTags("报表统计")
@Controller("reporting")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("admin", "agent")
@ApiBearerAuth("access-token")
export class ReportingController {
  constructor(private readonly reportingService: ReportingService) {}

  @Get("dashboard")
  @ApiOperation({ summary: "获取仪表盘统计" })
  async getDashboard() {
    return this.reportingService.getDashboardStats();
  }

  @Get("tickets")
  @ApiOperation({ summary: "获取工单统计" })
  async getTicketStats(
    @Query("startDate") startDate?: string,
    @Query("endDate") endDate?: string
  ) {
    return this.reportingService.getTicketStats(
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined
    );
  }
}

