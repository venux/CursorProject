import { Controller, Get, Patch, Param, UseGuards, Request } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { NotificationService } from "./notification.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";

@ApiTags("通知管理")
@Controller("notifications")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth("access-token")
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  @ApiOperation({ summary: "获取通知列表" })
  async findAll(@Request() req: any, @Request() query?: { unread?: string }) {
    return this.notificationService.findByUser(
      req.user.id,
      query?.unread === "true"
    );
  }

  @Patch(":id/read")
  @ApiOperation({ summary: "标记为已读" })
  async markAsRead(@Param("id") id: string, @Request() req: any) {
    return this.notificationService.markAsRead(id, req.user.id);
  }

  @Patch("read-all")
  @ApiOperation({ summary: "标记全部为已读" })
  async markAllAsRead(@Request() req: any) {
    await this.notificationService.markAllAsRead(req.user.id);
    return { message: "已标记全部为已读" };
  }
}

