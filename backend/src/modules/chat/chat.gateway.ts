import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";

@WebSocketGateway({ cors: true })
export class ChatGateway {
  @WebSocketServer()
  server!: Server;

  @SubscribeMessage("ping")
  handlePing(@MessageBody() data: string) {
    return { event: "pong", data };
  }
}

