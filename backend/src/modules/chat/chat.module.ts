import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ChatGateway } from "./chat.gateway";
import { ChatController } from "./chat.controller";
import { Session, SessionSchema } from "../../common/schemas/session.schema";
import { Message, MessageSchema } from "../../common/schemas/message.schema";
import { AuthModule } from "../../modules/auth/auth.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Session.name, schema: SessionSchema },
      { name: Message.name, schema: MessageSchema }
    ]),
    AuthModule
  ],
  controllers: [ChatController],
  providers: [ChatGateway],
  exports: [ChatGateway]
})
export class ChatModule {}

