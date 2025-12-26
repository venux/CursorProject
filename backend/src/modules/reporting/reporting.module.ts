import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ReportingController } from "./reporting.controller";
import { ReportingService } from "./reporting.service";
import { Ticket, TicketSchema } from "../../common/schemas/ticket.schema";
import { Session, SessionSchema } from "../../common/schemas/session.schema";
import { User, UserSchema } from "../../common/schemas/user.schema";
import { AuthModule } from "../../modules/auth/auth.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Ticket.name, schema: TicketSchema },
      { name: Session.name, schema: SessionSchema },
      { name: User.name, schema: UserSchema }
    ]),
    AuthModule
  ],
  controllers: [ReportingController],
  providers: [ReportingService],
  exports: [ReportingService]
})
export class ReportingModule {}

