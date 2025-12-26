import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { TicketService } from "./ticket.service";
import { TicketController } from "./ticket.controller";
import { Ticket, TicketSchema } from "../../common/schemas/ticket.schema";
import { AuthModule } from "../../modules/auth/auth.module";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Ticket.name, schema: TicketSchema }]),
    AuthModule
  ],
  providers: [TicketService],
  controllers: [TicketController],
  exports: [TicketService]
})
export class TicketModule {}

