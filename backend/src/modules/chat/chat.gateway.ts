import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { Logger, UseGuards } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Session, SessionDocument, SessionStatus } from "../../common/schemas/session.schema";
import { Message, MessageDocument, MessageType } from "../../common/schemas/message.schema";

@WebSocketGateway({
  cors: {
    origin: "*",
    credentials: true
  },
  namespace: "/chat"
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(ChatGateway.name);
  private activeSessions = new Map<string, string>(); // socketId -> sessionId
  private userSockets = new Map<string, string>(); // userId -> socketId

  constructor(
    @InjectModel(Session.name) private sessionModel: Model<SessionDocument>,
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>
  ) {}

  async handleConnection(client: Socket) {
    this.logger.log(`客户端连接: ${client.id}`);
    const userId = client.handshake.auth?.userId || client.handshake.query?.userId;
    if (userId) {
      this.userSockets.set(userId as string, client.id);
    }
  }

  async handleDisconnect(client: Socket) {
    this.logger.log(`客户端断开: ${client.id}`);
    const sessionId = this.activeSessions.get(client.id);
    if (sessionId) {
      const session = await this.sessionModel.findById(sessionId);
      if (session && session.status === SessionStatus.CONNECTED) {
        session.status = SessionStatus.WAITING;
        await session.save();
        this.server.emit("session:status", { sessionId, status: SessionStatus.WAITING });
      }
      this.activeSessions.delete(client.id);
    }
    // 清理用户socket映射
    for (const [userId, socketId] of this.userSockets.entries()) {
      if (socketId === client.id) {
        this.userSockets.delete(userId);
        break;
      }
    }
  }

  @SubscribeMessage("session:create")
  async handleCreateSession(
    @MessageBody() data: { userId: string; channel?: string },
    @ConnectedSocket() client: Socket
  ) {
    const sessionId = `SESS-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const session = await this.sessionModel.create({
      sessionId,
      userId: data.userId,
      status: SessionStatus.QUEUING,
      channel: data.channel || "web"
    });
    this.activeSessions.set(client.id, session._id.toString());
    client.join(`session:${sessionId}`);
    return { event: "session:created", data: { sessionId, session } };
  }

  @SubscribeMessage("message:send")
  async handleMessage(
    @MessageBody() data: { sessionId: string; content: string; type?: MessageType; attachments?: string[] },
    @ConnectedSocket() client: Socket
  ) {
    const session = await this.sessionModel.findOne({ sessionId: data.sessionId });
    if (!session) {
      return { event: "error", data: { message: "会话不存在" } };
    }

    const userId = client.handshake.auth?.userId || session.userId;
    const message = await this.messageModel.create({
      sessionId: session._id.toString(),
      senderId: userId,
      type: data.type || MessageType.TEXT,
      content: data.content,
      attachments: data.attachments || []
    });

    // 更新会话状态和消息计数
    if (session.status === SessionStatus.QUEUING) {
      session.status = SessionStatus.CONNECTED;
      session.connectedAt = new Date();
    }
    session.messageCount += 1;
    await session.save();

    // 广播消息
    this.server.to(`session:${data.sessionId}`).emit("message:received", {
      message: {
        id: message._id.toString(),
        sessionId: data.sessionId,
        senderId: userId,
        content: data.content,
        type: message.type,
        createdAt: message.createdAt
      }
    });

    return { event: "message:sent", data: { messageId: message._id.toString() } };
  }

  @SubscribeMessage("session:assign")
  async handleAssignSession(
    @MessageBody() data: { sessionId: string; agentId: string }
  ) {
    const session = await this.sessionModel.findOne({ sessionId: data.sessionId });
    if (!session) {
      return { event: "error", data: { message: "会话不存在" } };
    }

    session.agentId = data.agentId;
    session.status = SessionStatus.CONNECTED;
    session.connectedAt = new Date();
    await session.save();

    this.server.to(`session:${data.sessionId}`).emit("session:assigned", {
      sessionId: data.sessionId,
      agentId: data.agentId
    });

    return { event: "session:assigned", data: { sessionId: data.sessionId, agentId: data.agentId } };
  }

  @SubscribeMessage("session:end")
  async handleEndSession(
    @MessageBody() data: { sessionId: string }
  ) {
    const session = await this.sessionModel.findOne({ sessionId: data.sessionId });
    if (!session) {
      return { event: "error", data: { message: "会话不存在" } };
    }

    session.status = SessionStatus.ENDED;
    session.endedAt = new Date();
    await session.save();

    this.server.to(`session:${data.sessionId}`).emit("session:ended", {
      sessionId: data.sessionId
    });

    return { event: "session:ended", data: { sessionId: data.sessionId } };
  }
}

