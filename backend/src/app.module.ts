import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import configuration from "./common/config/configuration";
import { HealthModule } from "./health/health.module";
import { AuthModule } from "./modules/auth/auth.module";
import { TicketModule } from "./modules/ticket/ticket.module";
import { ChatModule } from "./modules/chat/chat.module";
import { KnowledgeModule } from "./modules/knowledge/knowledge.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration]
    }),
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: process.env.MONGO_URI || "mongodb://localhost:27017/cs-platform"
      })
    }),
    HealthModule,
    AuthModule,
    TicketModule,
    ChatModule,
    KnowledgeModule
  ]
})
export class AppModule {}

