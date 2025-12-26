import { Controller, Get, Put, Body, UseGuards, Request } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { UserService } from "./user.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";

@ApiTags("用户管理")
@Controller("users")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth("access-token")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("profile")
  @ApiOperation({ summary: "获取当前用户信息" })
  async getProfile(@Request() req: any) {
    const user = await this.userService.findById(req.user.id);
    if (!user) {
      throw new Error("用户不存在");
    }
    return {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      displayName: user.displayName,
      avatar: user.avatar,
      role: user.role,
      preferences: user.preferences
    };
  }

  @Put("profile")
  @ApiOperation({ summary: "更新用户资料" })
  async updateProfile(
    @Body() updates: { displayName?: string; avatar?: string; preferences?: Record<string, any> },
    @Request() req: any
  ) {
    return this.userService.updateProfile(req.user.id, updates);
  }

  @Get("agents")
  @UseGuards(RolesGuard)
  @Roles("admin", "agent")
  @ApiOperation({ summary: "获取坐席列表" })
  async getAgents() {
    return this.userService.getAgents();
  }
}

