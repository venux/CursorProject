import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import configuration from "./common/config/configuration";
import { HealthModule } from "./health/health.module";
import { AuthModule } from "./modules/auth/auth.module";
import { UserModule } from "./modules/user/user.module";
import { TicketModule } from "./modules/ticket/ticket.module";
import { ChatModule } from "./modules/chat/chat.module";
import { KnowledgeModule } from "./modules/knowledge/knowledge.module";
import { NotificationModule } from "./modules/notification/notification.module";
import { ReportingModule } from "./modules/reporting/reporting.module";
import { AuditModule } from "./modules/audit/audit.module";

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
    UserModule,
    TicketModule,
    ChatModule,
    KnowledgeModule,
    NotificationModule,
    ReportingModule,
    AuditModule
  ]
})
export class AppModule {}

