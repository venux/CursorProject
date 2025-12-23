import { Controller, Get } from "@nestjs/common";
import { TicketService, Ticket } from "./ticket.service";

@Controller("tickets")
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Get()
  findAll(): Ticket[] {
    return this.ticketService.findAll();
  }
}

