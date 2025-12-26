import { Controller, Get, Post, Param, Body, UseGuards, Request } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Session, SessionDocument } from "../../common/schemas/session.schema";
import { Message, MessageDocument } from "../../common/schemas/message.schema";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";

@ApiTags("聊天管理")
@Controller("chat")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth("access-token")
export class ChatController {
  constructor(
    @InjectModel(Session.name) private sessionModel: Model<SessionDocument>,
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>
  ) {}

  @Get("sessions")
  @ApiOperation({ summary: "获取会话列表" })
  async getSessions(@Request() req: any) {
    const query: any = {};
    if (req.user.role === "user") {
      query.userId = req.user.id;
    } else if (req.user.role === "agent") {
      query.agentId = req.user.id;
    }
    return this.sessionModel.find(query).sort({ createdAt: -1 }).limit(50).exec();
  }

  @Get("sessions/:sessionId")
  @ApiOperation({ summary: "获取会话详情" })
  async getSession(@Param("sessionId") sessionId: string) {
    return this.sessionModel.findOne({ sessionId }).exec();
  }

  @Get("sessions/:sessionId/messages")
  @ApiOperation({ summary: "获取会话消息" })
  async getMessages(@Param("sessionId") sessionId: string) {
    const session = await this.sessionModel.findOne({ sessionId }).exec();
    if (!session) {
      return [];
    }
    return this.messageModel.find({ sessionId: session._id.toString() }).sort({ createdAt: 1 }).exec();
  }
}

